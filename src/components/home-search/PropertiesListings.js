'use client';

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import SortByDropdown from '../uis/SortByDropdown';
import dynamic from 'next/dynamic';
import { transformPropertyData } from '../../utils/property-utils';
import { useRouter } from 'next/navigation';
import { FaSearch, FaHeart, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

const GoogleMap = dynamic(() => import('./GoogleMap'), {
  ssr: false,
  loading: () => <p>Loading Google Maps...</p>
});
import PropertyCard from '../uis/PropertyCard';
import SidebarToggleButton from '../uis/SidebarToggleButton';
import useFilterStore from '../../store/filters';
import useMapStore from '../../store/mapStore';
import usePropertyStore from '../../store/propertyStore';
import Button from '../uis/Button';
import useViewStore from '../../store/viewStore';

const PropertiesListings = () => {
  const [allProperties, setAllProperties] = useState([]);
  const safeStoreProperties = usePropertyStore((state) => state.allProperties);
  const [sortBy, setSortBy] = useState('Price: High to Low');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoadingMapProperties, setIsLoadingMapProperties] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [canRetry, setCanRetry] = useState(false);
  const [fetchAllPropertiesError, setFetchAllPropertiesError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'saved', 'login'/'logout'
  const [selectedProperty, setSelectedProperty] = useState(null); // Track selected property for mobile map view
  const { viewMode } = useViewStore();

  const fetchRequestInFlight = useRef(0);
  const hasLoadedOnce = useRef(false); // Track if properties have been loaded at least once
  const [clientRouter, setClientRouter] = useState(null);
  const nextRouter = useRouter();
  
  // Check if properties have been loaded before in localStorage
  useEffect(() => {
    const hasLoadedPreviously = localStorage.getItem('propertiesLoadedOnce');
    if (hasLoadedPreviously === 'true') {
      hasLoadedOnce.current = true;
    }
  }, []);

  useEffect(() => {
    setClientRouter(nextRouter);
  }, [nextRouter]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(20);
  


  // Get filter values from store
  const {
    listingType,
    priceRange,
    bedrooms,
    bathrooms,
    propertyTypes,
    listingStatus,
    daysOnMarket,
    moveInDate,
    squareFeet,
    lotSize,
    yearBuilt,
    garageSpaces,
    features,
    keyword,
    associationFee,
    resetFilters,
  } = useFilterStore();
  const mapBounds = useMapStore((state) => state.mapBounds);
  const setAllPropertiesInStore = usePropertyStore((state) => state.setAllProperties);

  // Fetch user status for login/logout tab
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(data.isAuthenticated);
          if (data.isAuthenticated) {
            setUserName(data.user.email);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user status', error);
      }
    };
    fetchUserStatus();
  }, []);
  
  // Placeholder for fetchFallbackProperties
  const fetchFallbackProperties = useCallback(async () => {
    // Implement actual fallback logic here if needed
    // For now, just a placeholder
    setIsLoadingMapProperties(false);
  }, []);

  // Fetch all properties for map display (without pagination)
  const fetchAllProperties = useCallback(async () => {
    setIsLoadingMapProperties(true);
    setFetchAllPropertiesError(null);

    try {
      // Use the new API endpoint to get all properties in batches to avoid timeouts
      let allPropertiesData = [];
      let skip = 0;
      const limit = 1000; // Fetch up to 1000 per request
      let hasMore = true;
      const maxRetries = 3;
      const maxSkip = 50000; // Allow fetching up to 50,000 properties

      while (hasMore && skip < maxSkip) {
        let retryCount = 0;
        try {
          const url = `/api/properties/all?limit=${limit}&skip=${skip}`;

          const res = await fetch(url);

          if (!res.ok) {
            console.error(`Failed to fetch properties batch (skip=${skip}):`, res.status);
            const errorData = await res.text();
            console.error(`Error details:`, errorData);
            if (res.status === 500 && retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000));
              retryCount++;
              continue;
            } else {
              break;
            }
          }

          const data = await res.json();

          if (!data.value || data.value.length === 0) {
            break;
          }

          const transformed = data.value.map(item => {
            try {
              return transformPropertyData(item);
            } catch (error) {
              console.error('Error transforming property:', error, item);
              return null;
            }
          }).filter(property => property !== null);
          allPropertiesData = [...allPropertiesData, ...transformed];

          // Update global store with each batch to provide immediate feedback to the UI
          setAllPropertiesInStore([...allPropertiesData]);

          // Check if there are more properties to fetch
          hasMore = data.pagination?.hasNextPage;
          skip += limit;

          // Add a small delay to prevent rate limiting
          await new Promise(resolve => setTimeout(resolve, 50));

        } catch (batchError) {
          console.error(`Error fetching properties batch (skip=${skip}):`, batchError);
          break;
        }
      }

      setAllProperties(allPropertiesData); // Set properties directly in the local state
      setAllPropertiesInStore(allPropertiesData); // Also update the global store
      localStorage.setItem('cachedProperties', JSON.stringify(allPropertiesData)); // Cache properties to localStorage

      if (allPropertiesData.length === 0) {
        await fetchFallbackProperties();
      }

    } catch (e) {
      console.error('Failed to fetch all properties for map', e);
      // If the new endpoint fails, fall back to the paginated approach
      try {
        let allPropertiesData = [];
        let page = 1;
        const maxPages = 200; // Increase to fetch more properties
        const maxRetries = 2; // Standard retries
        const limit = 200; // Fetch more per request to reduce requests

        while (page <= maxPages) {
          let retryCount = 0;
          try {
            const url = `/api/properties?page=${page}&limit=${limit}`;


            const res = await fetch(url);

            if (!res.ok) {
              console.error(`Failed to fetch page ${page}:`, res.status);
              const errorData = await res.text();
              console.error(`Error details:`, errorData);
              if (res.status === 500 && retryCount < maxRetries) {

                await new Promise(resolve => setTimeout(resolve, 1000));
                retryCount++;
                continue;
              } else {
                break;
              }
            }

            const data = await res.json();


            if (!data.value || data.value.length === 0) {
              break;
              break;
            }

            const transformed = data.value.map(item => {
              try {
                return transformPropertyData(item);
              } catch (error) {
                console.error('Error transforming property:', error, item);
                return null;
              }
            }).filter(property => property !== null);
            allPropertiesData = [...allPropertiesData, ...transformed];

            // Update global store with each batch to provide immediate feedback to the UI
            setAllPropertiesInStore([...allPropertiesData]);

            if (!data.pagination?.hasNextPage) {
              break;
              break;
            }

            page++;
            await new Promise(resolve => setTimeout(resolve, 50)); // Small delay to prevent rate limiting

          } catch (pageError) {
            console.error(`Error fetching page ${page}:`, pageError);
            break;
          }
        }


        setAllProperties(allPropertiesData); // Set properties directly in the local state
        setAllPropertiesInStore(allPropertiesData); // Also update the global store
        localStorage.setItem('cachedProperties', JSON.stringify(allPropertiesData)); // Cache properties to localStorage

        if (allPropertiesData.length === 0) {

          await fetchFallbackProperties();
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw fallbackError;
      }
    } finally {
      setIsLoadingMapProperties(false);
    }
  }, [fetchFallbackProperties, setIsLoadingMapProperties, setFetchAllPropertiesError, setAllPropertiesInStore]);

  // Load properties with comprehensive bounds loading
  const loadPropertiesInBounds = useCallback(async (bounds) => {
    if (!bounds) return;

    const requestId = ++fetchRequestInFlight.current;
    setIsLoadingMapProperties(true);
    setFetchError(null);

    try {
      const { ne, sw } = bounds;
      if (!ne?.lat || !ne?.lng || !sw?.lat || !sw?.lng) {
        return;
      }

      const apiBounds = {
        north: ne.lat,
        south: sw.lat,
        east: ne.lng,
        west: sw.lng,
      };
      const boundsParam = encodeURIComponent(JSON.stringify(apiBounds));
      const limit = 200; // Increase limit for more properties in bounds
      let page = 1;
      const maxPages = 50; // Increase max pages to get more properties in bounds
      const maxRetries = 2; // Standard retries

      // Fetch all properties within bounds
      while (page <= maxPages) {
        let retryCount = 0;
        if (requestId !== fetchRequestInFlight.current) return;

        const url = `/api/properties?bounds=${boundsParam}&limit=${limit}&page=${page}`;
        const res = await fetch(url);

        if (requestId !== fetchRequestInFlight.current) return;

        if (!res.ok) {
          console.warn(`Failed to fetch page ${page}`);
          const errorData = await res.text();
          console.error(`Error details:`, errorData);
          if (res.status === 500 && retryCount < maxRetries) {

            await new Promise(resolve => setTimeout(resolve, 1000));
            retryCount++;
            continue;
          } else {
            break;
          }
        }

        const data = await res.json();
        if (requestId === fetchRequestInFlight.current) {
          const transformed = data.value.map(item => {
            try {
              return transformPropertyData(item);
            } catch (error) {
              console.error('Error transforming property:', error, item);
              return null;
            }
          }).filter(property => property !== null);
          setAllProperties((prevProperties) => {
            const existingIds = new Set(prevProperties.map((p) => p.id));
            const uniqueNewProperties = transformed.filter(
              (p) => !existingIds.has(p.id)
            );
            return [...prevProperties, ...uniqueNewProperties];
          });
          
          // Also add to the global store
          usePropertyStore.getState().addProperties(transformed);
        }

        if (!data.pagination?.hasNextPage) {
          break;
          break;
        }
        page++;
        await new Promise(resolve => setTimeout(resolve, 50)); // Small delay to prevent rate limiting
      }
    } catch (e) {
      console.error('Failed to load properties in bounds:', e);
      if (requestId === fetchRequestInFlight.current) {
        setFetchError(e.message || 'An error occurred while fetching properties.');
      }
    } finally {
      if (requestId === fetchRequestInFlight.current) {
        setIsLoadingMapProperties(false);
      }
    }
  }, [setIsLoadingMapProperties]);

  // Initialize properties when component mounts
  useEffect(() => {

    
    if (safeStoreProperties.length === 0) {
      // Check if we have cached properties in localStorage
      const cachedProperties = localStorage.getItem('cachedProperties');
      if (cachedProperties) {
        try {
          const parsedProperties = JSON.parse(cachedProperties);
          if (parsedProperties && parsedProperties.length > 0) {
            // Load cached properties into the store
            setAllProperties(parsedProperties);
            setAllPropertiesInStore(parsedProperties);
            hasLoadedOnce.current = true;
            localStorage.setItem('propertiesLoadedOnce', 'true');

            return; // Early return to skip fetching
          }
        } catch (error) {
          console.error('Error parsing cached properties:', error);
          // If parsing fails, we'll proceed to fetch fresh data
        }
      }
      
      // If no cached properties or parsing failed, fetch fresh data
      if (!hasLoadedOnce.current) {
        fetchAllProperties().then(() => {
          hasLoadedOnce.current = true; // Mark that we've loaded data at least once
          localStorage.setItem('propertiesLoadedOnce', 'true'); // Persist this info
        });
      } else if (safeStoreProperties.length > 0) {
        // If we have data in store, mark that we've loaded once
        hasLoadedOnce.current = true;
        localStorage.setItem('propertiesLoadedOnce', 'true'); // Persist this info
      }
    } else {
      // If we have data in store, mark that we've loaded once
      hasLoadedOnce.current = true;
      localStorage.setItem('propertiesLoadedOnce', 'true'); // Persist this info
    }
  }, [safeStoreProperties, fetchAllProperties, setAllPropertiesInStore]); // Include all dependencies

  // Load properties in bounds when mapBounds change
  useEffect(() => {
    if (mapBounds) {
      loadPropertiesInBounds(mapBounds);
    }
  }, [mapBounds, loadPropertiesInBounds]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [bedrooms, bathrooms, priceRange, propertyTypes, listingStatus, daysOnMarket, moveInDate, squareFeet, lotSize, yearBuilt, garageSpaces, features, keyword, associationFee, listingType]);

  // Check if map is zoomed in on a single property
  const isZoomedToSingleProperty = useCallback((bounds) => {
    if (!bounds) return false;
    const { ne, sw } = bounds;
    const latDiff = Math.abs(ne.lat - sw.lat);
    const lngDiff = Math.abs(ne.lng - sw.lng);
    return latDiff < 0.001 && lngDiff < 0.001;
  }, []);

  // Separate filter functions for better performance and maintainability
  const filterByMapBounds = useCallback((property) => {
    if (!mapBounds) return true;
    const { ne, sw } = mapBounds;

    if (isZoomedToSingleProperty(mapBounds)) {
      const centerLat = (ne.lat + sw.lat) / 2;
      const centerLng = (ne.lng + sw.lng) / 2;
      const distance = Math.sqrt(
        Math.pow(property.lat - centerLat, 2) +
        Math.pow(property.lng - centerLng, 2)
      );
      return distance < 0.0005;
    }

    return !(property.lat > ne.lat || property.lat < sw.lat ||
      property.lng > ne.lng || property.lng < sw.lng);
  }, [mapBounds, isZoomedToSingleProperty]);

  const filterByBasicCriteria = useCallback((property) => {
    try {
      if (listingType) {
        const isForRent = property.PropertyType === 'Residential Lease';
        const category = isForRent ? 'For Rent' : 'For Sale';
        if (category !== listingType) return false;
      }

      const propertyPrice = Number(property.ListPrice || 0);
      if (propertyPrice < priceRange[0] || propertyPrice > priceRange[1]) return false;

      if (bedrooms !== 'Any') {
        const bedsCount = Number(property.BedroomsTotal ?? 0);
        if (bedrooms === 'Studio') {
          if (bedsCount !== 0 && bedsCount !== 1) return false;
        } else if (bedrooms === '5+') {
          if (bedsCount < 5) return false;
        } else {
          if (bedsCount !== Number(bedrooms)) return false;
        }
      }

      if (bathrooms !== 'Any') {
        const bathsCount = Number(property.BathroomsTotalInteger ?? 0);
        if (bathrooms === '5+') {
          if (bathsCount < 5) return false;
        } else {
          if (bathsCount !== Number(bathrooms)) return false;
        }
      }

      if (propertyTypes.length > 0) {
        const propertyType = property.type;
        if (!propertyTypes.includes(propertyType)) return false;
      }

      return true;
    } catch (e) {
      console.error('Error in basic criteria filter:', e);
      return false;
    }
  }, [listingType, priceRange, bedrooms, bathrooms, propertyTypes]);

  const filterByAdditionalCriteria = useCallback((property) => {
    try {
      if (listingStatus.length > 0) {
        const status = property.StandardStatus;
        if (!listingStatus.includes(status)) return false;
      }

      if (daysOnMarket !== 'Any') {
        const maxDaysMap = {
          '1 day': 1, '7 days': 7, '14 days': 14, '1 month': 30,
          '3 months': 90, '6 months': 180, '12 months': 365
        };
        const maxDays = maxDaysMap[daysOnMarket] || Number(daysOnMarket);
        const propertyDays = Number(property.DaysOnMarket || 0);
        if (propertyDays > maxDays) return false;
      }

      const livingArea = Number(property.LivingArea || 0);
      if (livingArea < squareFeet[0] || livingArea > squareFeet[1]) return false;

      const lotSizeAcres = Number(property.LotSizeAcres || 0);
      if (lotSizeAcres < lotSize[0] || lotSizeAcres > lotSize[1]) return false;

      const built = Number(property.YearBuilt || 0);
      if (built && (built < yearBuilt[0] || built > yearBuilt[1])) return false;

      if (garageSpaces > 0) {
        const spaces = Number(property.GarageSpaces || 0);
        if (spaces < garageSpaces) return false;
      }

      return true;
    } catch (e) {
      console.error('Error in additional criteria filter:', e);
      return false;
    }
  }, [listingStatus, daysOnMarket, squareFeet, lotSize, yearBuilt, garageSpaces]);

  const filterByComplexCriteria = useCallback((property) => {
    try {
      if (moveInDate) {
        const filterDate = new Date(moveInDate);
        const availabilityDate = property.AvailabilityDate ? new Date(property.AvailabilityDate) : null;
        if (availabilityDate && availabilityDate > filterDate) return false;
      }

      if (features.length > 0) {
        const propertyFeatures = [
          property.Amenities, property.InteriorFeatures, property.ExteriorFeatures,
          property.ParkingFeatures, property.PropertySubType
        ].filter(Boolean).join(' ').toLowerCase();

        const hasAllFeatures = features.every(feature =>
          propertyFeatures.includes(feature.toLowerCase())
        );
        if (!hasAllFeatures) return false;
      }

      if (associationFee !== 'All') {
        const hasAssociationFee = Number(property.AssociationFee || 0) > 0;
        if (associationFee === 'Yes' && !hasAssociationFee) return false;
        if (associationFee === 'No' && hasAssociationFee) return false;
      }

      if (keyword) {
        const searchTerm = keyword.toLowerCase();
        const searchableText = [
          property.UnparsedAddress, property.PublicRemarks, property.ListPrice?.toString(),
          property.ListingId, property.PropertySubType, property.Amenities,
          property.InteriorFeatures, property.ExteriorFeatures
        ].filter(Boolean).join(' ').toLowerCase();

        if (!searchableText.includes(searchTerm)) return false;
      }

      return true;
    } catch (e) {
      console.error('Error in complex criteria filter:', e);
      return false;
    }
  }, [moveInDate, features, associationFee, keyword]);

  // Apply filters to all properties with optimized order and memoization
  const allFilteredProperties = useMemo(() => {

    // Only apply filtering if we have properties
    if (!safeStoreProperties || safeStoreProperties.length === 0) {
      return [];
    }
    
    // Apply filters in optimized order: most selective first
    return safeStoreProperties.filter(property => {
      // Basic criteria are typically most selective, so check them first
      if (!filterByBasicCriteria(property)) return false;
      if (!filterByAdditionalCriteria(property)) return false;
      if (!filterByComplexCriteria(property)) return false;
      if (!filterByMapBounds(property)) return false;
      return true;
    });
  }, [safeStoreProperties, filterByMapBounds, filterByBasicCriteria, filterByAdditionalCriteria, filterByComplexCriteria]);

  // Sort and paginate properties
  const paginatedProperties = useMemo(() => {
    const sortedProperties = [...allFilteredProperties].sort((a, b) => {
      switch (sortBy) {
        case 'Price: Low to High':
          return a.ListPrice - b.ListPrice;
        case 'Price: High to Low':
          return b.ListPrice - a.ListPrice;
        case 'Square Feet':
          return (b.LivingArea || 0) - (a.LivingArea || 0);
        case 'Newest':
        default:
          return (a.DaysOnMarket || 0) - (b.DaysOnMarket || 0);
      }
    });

    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    return sortedProperties.slice(startIndex, endIndex);
  }, [allFilteredProperties, currentPage, propertiesPerPage, sortBy]);

  const totalProperties = allFilteredProperties.length;
  const hasNextPage = currentPage * propertiesPerPage < totalProperties;
  const hasPreviousPage = currentPage > 1;

  useEffect(() => {
    if (safeStoreProperties.length > 0) {
      const frame = requestAnimationFrame(() => {
        const timer = setTimeout(() => {
          setIsFiltering(false);
        }, 300);
        return () => clearTimeout(timer);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [safeStoreProperties.length, bedrooms, bathrooms, priceRange, propertyTypes, listingStatus,
    daysOnMarket, moveInDate, squareFeet, lotSize, yearBuilt, garageSpaces, features,
    keyword, associationFee, listingType]);

  useEffect(() => {
    if (safeStoreProperties.length > 0) {
      const uniqueTypes = [...new Set(safeStoreProperties.map(p => p.type).filter(Boolean))];

    }
  }, [safeStoreProperties]);

  const mapProperties = useMemo(() => {
    return allFilteredProperties;
  }, [allFilteredProperties]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleRetry = () => {
    fetchAllProperties();
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={viewMode === 'map' ? "h-screen relative bg-gray-100 touch-pan-y touch-pinch-zoom" : "flex h-screen relative bg-gray-100 touch-pan-y touch-pinch-zoom"}>
      {/* Left Panel - Property Listings */}
      <div className={
        viewMode === 'list'
          ? 'w-full bg-white overflow-y-auto'
          : `absolute md:max-h-screen bg-white overflow-y-auto h-screen top-10 md:top-0 left-0 w-full md:w-[45%] z-10 ${(sidebarOpen ? 'block' : 'hidden md:block')} transition-transform duration-300`
      }>
        <div className='flex w-full items-center md:items-start mb-4 flex-col bg-white py-5'>
          <div className=" border-b border-gray-200 w-full px-2">
            <div className="flex items-center pt-5 md:pt-0 z-[200] justify-between ">
              <h1 className="text-sm md:text-xl font-semibold text-gray-900">
                Real Estate & Homes for Sale
              </h1>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span>{allFilteredProperties.length} result{allFilteredProperties.length === 1 ? '' : 's'}</span>
              </div>
              <div className="flex items-center gap-4">
                {isLoadingMapProperties && (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="text-xs md:text-sm text-gray-500">Loading properties...</span>
                  </div>
                )}
                <SortByDropdown sortBy={sortBy} setSortBy={setSortBy} />
              </div>
            </div>
          </div>

          {fetchError && (
            <div className="w-full my-4 p-3 rounded bg-red-50 text-red-700 text-sm text-center">
              <p>{fetchError}</p>
              <button
                onClick={() => {
                  if (mapBounds) {
                    loadPropertiesInBounds(mapBounds);
                  } else {
                    loadPropertiesInBounds({
                      ne: { lat: 25.8617, lng: -80.0918 },
                      sw: { lat: 25.6617, lng: -80.2918 }
                    });
                  }
                }}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Retry
              </button>
            </div>
          )}

          {isFiltering && safeStoreProperties.length > 0 && (
            <div className="w-full py-4 text-center text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span>Applying filters...</span>
              </div>
            </div>
          )}

          {!isLoading && !fetchError && allFilteredProperties.length > 0 && (
            <>
              <div className={`flex flex-wrap flex-grow overflow-y-auto`}>
                {paginatedProperties.map((property, index) => {
                  const uniqueKey = `${property.id}-${index}-${property.mls || ''}`
                  return (
                    <Link
                      href={`/property/${property.id}`}
                      key={uniqueKey}
                      className={`${viewMode === 'list' ? 'w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5' : 'w-full lg:w-1/2 2xl:w-1/3 3xl:w-1/4 card-width'}  p-2`}
                    >
                      <PropertyCard property={property} />
                    </Link>
                  );
                })}
              </div>

              <div className="sticky bottom-0 z-50 w-full bg-white flex items-center justify-between mt-6 pb-10 md:pb-3 px-4 py-3 border-t border-gray-200">
                <div className="flex items-center w-full md:w-fit justify-between space-x-2">
                  <Button
                    onClick={handlePreviousPage}
                    disabled={!hasPreviousPage}
                    className={`px-3 py-2 text-xs md:text-sm font-medium rounded-md ${hasPreviousPage
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    Previous
                  </Button>

                  <span className="text-xs md:text-sm text-gray-600">
                    Page {currentPage} of {Math.ceil(totalProperties / propertiesPerPage)}
                  </span>

                  <Button
                    onClick={handleNextPage}
                    disabled={!hasNextPage}
                    className={`px-3 py-2 text-xs md:text-sm font-medium rounded-md ${hasNextPage
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    Next
                  </Button>
                </div>

                <div className=" hidden w-[50%] md:block text-xs md:text-sm text-gray-600">
                  Showing {paginatedProperties.length} of {totalProperties} properties
                </div>
              </div>
            </>
          )}
          
          {/* Show loading state when no properties yet but loading */}
          {!fetchError && allFilteredProperties.length === 0 && isLoadingMapProperties && (
            <div className="flex justify-center items-center h-64 w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {/* Show no results message */}
          {!isLoadingMapProperties && !fetchError && allFilteredProperties.length === 0 && safeStoreProperties.length > 0 && (
            <div className="flex justify-center items-center h-64 w-full text-gray-500">
              <p>No properties match your current filters.</p>
            </div>
          )}
        </div>
      </div>
      {viewMode === 'map' && <SidebarToggleButton sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />}

      <div className={viewMode === 'list' ? 'hidden' : "inset-0 md:flex-1/2 absolute md:static h-full w-full md:w-auto border-t border-gray-200 md:border-t-0"}>
        {fetchAllPropertiesError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 bg-opacity-90 z-10 p-4 text-center">
            <p className="text-lg text-red-700 font-semibold mb-4">
              Error loading map properties: {fetchAllPropertiesError.details}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={fetchAllProperties}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry Full Load
              </button>
              <button
                onClick={fetchFallbackProperties}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Load Basic Properties
              </button>
            </div>
          </div>
        ) : (
          <>
            {selectedProperty && (
              <div className="md:hidden absolute top-4 left-4 right-4 z-10 bg-white rounded-lg shadow-lg p-3 max-h-40 overflow-y-auto">
                <div 
                  onClick={() => {
                    if (clientRouter) {
                      clientRouter.push(`/property/${selectedProperty.id}`);
                    } else {
                      window.location.href = `/property/${selectedProperty.id}`;
                    }
                    setSelectedProperty(null);
                  }}
                  className="block w-full cursor-pointer"
                >
                  <PropertyCard property={selectedProperty} />
                </div>
                <button 
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProperty(null);
                  }}
                >
                  ✕
                </button>
              </div>
            )}
            <div className="h-full w-full mx-auto md:w-[60%] md:ml-[40%] flex-1 touch-pan-y touch-pinch-zoom">
              <GoogleMap 
                properties={mapProperties} 
                onPropertySelect={setSelectedProperty}
              />
            </div>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 z-30 w-full bg-white border-t border-gray-200 md:hidden shadow-lg pointer-events-none">
        <div className="flex justify-around h-16 items-center text-gray-600 text-xs font-medium">
          <button
            className={`flex flex-col items-center p-2 rounded-md transition-colors duration-200 ${activeTab === 'search' ? 'text-blue-600 bg-blue-50' : 'hover:bg-gray-50'} pointer-events-auto`}
            onClick={() => {
              setActiveTab('search');
              if (clientRouter) {
                clientRouter.push('/');
              }
            }}
          >
            <FaSearch className="h-5 w-5 mb-1" />
            <span>Search</span>
          </button>

          <button
            className={`flex flex-col items-center p-2 rounded-md transition-colors duration-200 ${activeTab === 'saved' ? 'text-blue-600 bg-blue-50' : 'hover:bg-gray-50'} pointer-events-auto`}
            onClick={() => {
              setActiveTab('saved');
              if (clientRouter) {
                clientRouter.push('/saved'); 
              }
            }}
          >
            <FaHeart className="h-5 w-5 mb-1" />
            <span>Saved</span>
          </button>

          {!isLoggedIn ? (
            <button
              className={`flex flex-col items-center p-2 rounded-md transition-colors duration-200 ${activeTab === 'login' ? 'text-blue-600 bg-blue-50' : 'hover:bg-gray-50'} pointer-events-auto`}
              onClick={() => {
                setActiveTab('login');
                if (clientRouter) {
                  clientRouter.push('/login');
                }
              }}
            >
              <FaSignInAlt className="h-5 w-5 mb-1" />
              <span>Login</span>
            </button>
          ) : (
            <button
              className={`flex flex-col items-center p-2 rounded-md transition-colors duration-200 ${activeTab === 'logout' ? 'text-blue-600 bg-blue-50' : 'hover:bg-gray-50'} pointer-events-auto`}
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                setIsLoggedIn(false);
                setUserName('');
                setActiveTab('search');
                if (clientRouter) {
                  clientRouter.push('/');
                }
              }}
            >
              <FaSignOutAlt className="h-5 w-5 mb-1" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesListings;