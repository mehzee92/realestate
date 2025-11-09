'use client';

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, OverlayView } from '@react-google-maps/api';
import useMapStore from '../../store/mapStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';
import { IoMdShare } from "react-icons/io";
import Link from 'next/link';

const containerStyle = {
  width: '100%',
  height: '100%',
};

// ======== Clustering Utility Functions ======== //
const clusterProperties = (properties, zoom) => {
  if (!properties || properties.length === 0) return [];
  if (zoom <= 8) return clusterByRadius(properties, 2.0);
  else if (zoom <= 10) return clusterByRadius(properties, 0.8);
  else if (zoom <= 12) return clusterByRadius(properties, 0.3);
  else return properties.map(p => ({ ...p, isCluster: false, clusterSize: 1, clusterProperties: [p] }));
};

const clusterByRadius = (properties, radius) => {
  const clusters = [];
  properties.forEach(property => {
    let addedToCluster = false;
    for (let cluster of clusters) {
      const distance = calculateDistance(cluster.lat, cluster.lng, property.lat, property.lng);
      if (distance <= radius) {
        cluster.clusterProperties.push(property);
        cluster.clusterSize++;
        addedToCluster = true;
        break;
      }
    }
    if (!addedToCluster) {
      clusters.push({
        ...property,
        isCluster: true,
        clusterSize: 1,
        clusterProperties: [property],
      });
    }
  });
  return clusters;
};

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ======== Main Component ======== //
const GoogleMapComponent = ({ properties }) => {
  const router = useRouter();
  const setMapBounds = useMapStore((state) => state.setMapBounds);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const [map, setMap] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(14); // Increased zoom level for Bal Harbour/Bay Harbour area
  const [center, setCenter] = useState(() => {
    if (
      properties &&
      properties.length === 1 &&
      properties[0] &&
      typeof properties[0].lat === 'number' &&
      isFinite(properties[0].lat) &&
      typeof properties[0].lng === 'number' &&
      isFinite(properties[0].lng)
    ) {
      return { lat: properties[0].lat, lng: properties[0].lng };
    }
    return { lat: 25.8757, lng: -80.1334 }; // Bal Harbour/Bay Harbour area
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [lastLatLng, setLastLatLng] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Load Google Maps API
  const apiKey = 'AIzaSyCOikS9vy1EMNjx04ysU9MhNaQW_7nHu28';
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
    libraries: ['places', 'geometry'],
  });

  // ======== Fetch User ======== //
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.isAuthenticated) setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };
    fetchUser();
  }, []);

  // ======== Check Favorite Status ======== //
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && selectedMarker) {
        try {
          const res = await fetch(`/api/properties/${selectedMarker.id}/is-favorite`);
          if (res.ok) {
            const data = await res.json();
            setIsFavorited(data.isFavorited);
          }
        } catch (error) {
          console.error('Failed to fetch favorite status', error);
        }
      }
    };
    checkFavoriteStatus();
  }, [user, selectedMarker]);

  // ======== Handle Favorite ======== //
  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      alert("Please log in to favorite properties.");
      return;
    }
    const newFavoritedState = !isFavorited;
    setIsFavorited(newFavoritedState);
    try {
      const response = await fetch(`/api/properties/${selectedMarker.id}/favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorited: newFavoritedState }),
      });
      if (!response.ok) {
        setIsFavorited(!newFavoritedState);
        throw new Error('Failed to update favorite status');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ======== Handle Share ======== //
  const handleShareClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (navigator.share) {
      navigator
        .share({
          title: selectedMarker.address,
          text: `Check out this property: ${selectedMarker.address}`,
          url: `${window.location.origin}/property/${selectedMarker.id}`,
        })
        .catch((error) => console.error('Error sharing', error));
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/property/${selectedMarker.id}`);
      alert('Link copied to clipboard!');
    }
  };

  // ======== Simple Direct Navigation - NO BULLSHIT ======== //
  const handleCardClick = useCallback(() => {
    if (selectedMarker?.id) {
      router.push(`/property/${selectedMarker.id}`);
    }
  }, [selectedMarker, router]);

  // ======== Map Handlers ======== //
  const onLoad = useCallback((map) => {
    setMap(map);
    setCurrentZoom(map.getZoom());
    try {
      const currentCenter = map.getCenter();
      if (currentCenter)
        setLastLatLng({ lat: currentCenter.lat(), lng: currentCenter.lng() });
    } catch { }
  }, []);

  const onUnmount = useCallback(() => setMap(null), []);

  const handleZoomChanged = useCallback(() => {
    if (map) setCurrentZoom(map.getZoom());
  }, [map]);

  useEffect(() => {
    if (map) {
      const idleListener = map.addListener('idle', () => {
        const bounds = map.getBounds();
        if (bounds) {
          setMapBounds({
            ne: { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() },
            sw: { lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng() },
          });
        }
      });
      const zoomListener = map.addListener('zoom_changed', handleZoomChanged);

      return () => {
        window.google.maps.event.removeListener(idleListener);
        window.google.maps.event.removeListener(zoomListener);
      };
    }
  }, [map, setMapBounds, handleZoomChanged]);

  const handleMarkerClick = (property) => {
    setSelectedMarker(property);
    if (property?.lat && property?.lng) {
      setLastLatLng({ lat: property.lat, lng: property.lng });
    }
  };

  // ======== Clustered Properties ======== //
  const clusteredProperties = useMemo(() => {
    if (!properties?.length) return [];
    const valid = properties.filter(
      (p) => typeof p.lat === 'number' && typeof p.lng === 'number'
    );
    return clusterProperties(valid, currentZoom);
  }, [properties, currentZoom]);

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gray-200 p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Google Maps Error</h3>
          <p className="text-gray-600 mb-2">Failed to load Google Maps</p>
          <p className="text-sm text-gray-500">Error: {loadError.message || 'Invalid API key or network error'}</p>
          <p className="text-sm text-gray-500 mt-2">Add a valid NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file</p>
        </div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gray-200 p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Google Maps API Key Required</h3>
          <p className="text-gray-600 mb-3">Please set up your Google Maps API key in your environment variables.</p>
          <p className="text-sm text-gray-500">Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-200">
        <div>Loading Google Maps...</div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={currentZoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={(e) => {
          setSelectedMarker(null);
          if (e?.latLng)
            setLastLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        }}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: false,
          gestureHandling: 'greedy',
        }}
      >
        {/* ======== Markers ======== */}
        {clusteredProperties.map((item, index) => (
          <Marker
            key={
              item.isCluster
                ? `cluster-${item.lat}-${item.lng}-${index}`
                : `property-${item.id}-${index}`
            }
            position={{ lat: item.lat, lng: item.lng }}
            onClick={() => handleMarkerClick(item)}
            clickable={true}
            className="z-[999999]"
            icon={{
              url:
                'data:image/svg+xml;charset=UTF-8,' +
                encodeURIComponent(`
                  <svg width="${getMarkerSize(currentZoom)}" height="${getMarkerSize(currentZoom)}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" fill="#fb2c36" stroke="#FFFFFF" stroke-width="2"/>
                  </svg>
                `),
              scaledSize: new window.google.maps.Size(
                getMarkerSize(currentZoom),
                getMarkerSize(currentZoom)
              ),
              anchor: new window.google.maps.Point(
                getMarkerSize(currentZoom) / 2,
                getMarkerSize(currentZoom) / 2
              ),
            }}
          />
        ))}

        {/* ======== Overlay Popup - Using Custom OverlayView for Perfect Positioning ======== */}
        {selectedMarker && (
            <OverlayView
              position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
              mapPaneName={OverlayView.FLOAT_PANE}
              getPixelPositionOffset={(w, h) => ({
                x: -(w / 2),
                y: -(h + 20),
              })}
            >
              <div
                style={{
                  position: 'absolute',
                  zIndex: 999999,
                  touchAction: 'auto',
                  WebkitTapHighlightColor: 'transparent',
                  WebkitTouchCallout: 'none',
                }}
                className='z-[999999]'
              >
                <div
                  onClick={handleCardClick}
                  onTouchStart={(e) => {
                    touchStartRef.current = {
                      x: e.touches[0].clientX,
                      y: e.touches[0].clientY,
                      time: Date.now(),
                    };
                  }}
                  onTouchEnd={(e) => {
                    const { x, y, time } = touchStartRef.current;
                    const endX = e.changedTouches[0].clientX;
                    const endY = e.changedTouches[0].clientY;
                    const endTime = Date.now();
                    if (
                      endTime - time < 200 &&
                      Math.abs(endX - x) < 10 &&
                      Math.abs(endY - y) < 10
                    ) {
                      handleCardClick();
                    }
                  }}
                  style={{
                    pointerEvents: 'auto',
                    touchAction: 'manipulation',
                  }}
                  className="w-[300px] rounded-2xl shadow-2xl bg-white overflow-hidden select-none cursor-pointer"
                >
                  <div className="h-36 bg-gray-100 relative">
                    {selectedMarker.image && (
                      <Image
                        src={selectedMarker.image}
                        alt={selectedMarker.address || 'Property image'}
                        width={300}
                        height={144}
                        className="w-full h-full object-cover"
                        unoptimized
                        draggable={false}
                      />
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-2" style={{ zIndex: 10 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavoriteClick(e);
                        }}
                        className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-md active:scale-95"
                      >
                        <FaHeart
                          className={`${isFavorited ? 'text-red-500' : 'text-gray-600'
                            } text-base`}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareClick(e);
                        }}
                        className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-md active:scale-95"
                      >
                        <IoMdShare className="text-gray-600 text-base" />
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-lg font-semibold text-gray-900">
                      $ {selectedMarker.ListPrice}
                    </p>
                    <p className="mt-1 text-sm text-gray-700 line-clamp-1">
                      {selectedMarker.address}
                    </p>
                  </div>
                </div>
              </div>
            </OverlayView>
        )}
      </GoogleMap>
    </div>
  );
};

// ======== Marker Size Helper ======== //
const getMarkerSize = (zoom) => {
  if (zoom <= 8) return 20;
  if (zoom <= 10) return 18;
  if (zoom <= 12) return 16;
  if (zoom <= 14) return 14;
  return 12;
};

export default GoogleMapComponent;