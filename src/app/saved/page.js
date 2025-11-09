"use client";
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropertyCard from '../../components/uis/PropertyCard';
import Link from 'next/link';
import SortByDropdown from '../../components/uis/SortByDropdown';
import Button from '../../components/uis/Button';
import { transformPropertyData } from '../../utils/property-utils';

const SavedPropertiesPage = () => {
  const [allSavedProperties, setAllSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('Price: High to Low');
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(20);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const res = await fetch('/api/saved-properties');
        if (!res.ok) {
          if (res.status === 401) {
            setError('Please log in to view your saved properties.');
          } else {
            setError('Failed to fetch saved properties.');
          }
          setLoading(false);
          return;
        }
        const data = await res.json();
        setAllSavedProperties(data.properties.map(transformPropertyData));
      } catch (err) {
        console.error('Error fetching saved properties:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, []);

  const sortedProperties = useMemo(() => {
    return [...allSavedProperties].sort((a, b) => {
      switch (sortBy) {
        case 'Price: Low to High':
          return (parseInt((a.price || '').replace(/[^0-9]/g, '')) || 0) - (parseInt((b.price || '').replace(/[^0-9]/g, '')) || 0);
        case 'Price: High to Low':
          return (parseInt((b.price || '').replace(/[^0-9]/g, '')) || 0) - (parseInt((a.price || '').replace(/[^0-9]/g, '')) || 0);
        case 'Square Feet':
          return (b.LivingArea || 0) - (a.LivingArea || 0);
        case 'Newest':
        default:
          return (a.DaysOnMarket || 0) - (b.DaysOnMarket || 0);
      }
    });
  }, [allSavedProperties, sortBy]);

  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    return sortedProperties.slice(startIndex, endIndex);
  }, [sortedProperties, currentPage, propertiesPerPage]);

  const totalProperties = sortedProperties.length;
  const hasNextPage = currentPage * propertiesPerPage < totalProperties;
  const hasPreviousPage = currentPage > 1;

  const handleNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const handlePreviousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPreviousPage]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading saved properties...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className=" mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-6">Your Saved Properties</h1>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          <span>{totalProperties} result{totalProperties === 1 ? '' : 's'}</span>
        </div>
        <SortByDropdown sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      {
        totalProperties === 0 ? (
          <p className="text-gray-600">You haven&apos;t saved any properties yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProperties.map((property) => (
                <Link href={`/property/${property.id}`} key={property.id}>
                  <PropertyCard property={property} />
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between w-full mt-6 px-4 py-3 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handlePreviousPage}
                  disabled={!hasPreviousPage}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    hasPreviousPage
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Previous
                </Button>

                <span className="text-sm text-gray-600">
                  Page {currentPage} of {Math.ceil(totalProperties / propertiesPerPage)}
                </span>

                <Button
                  onClick={handleNextPage}
                  disabled={!hasNextPage}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    hasNextPage
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                </Button>
              </div>

              <div className="text-sm text-gray-600">
                Showing {paginatedProperties.length} of {totalProperties} properties
              </div>
            </div>
          </>
        )
      }
    </div>
  );
};

export default SavedPropertiesPage;