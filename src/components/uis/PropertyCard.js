import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Headings from './Headings';
import P from './P';
import { FaHeart } from 'react-icons/fa';
import { IoMdShare } from "react-icons/io";


const PropertyCard = ({ property, setSelectedProperty }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [user, setUser] = useState(null);
console.log("Property object:", property);
console.log("Property image:", property.image);
console.log("Property Media:", property.Media);
console.log("Property galleryImages:", property.galleryImages);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.isAuthenticated) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && property) {
        try {
          const res = await fetch(`/api/properties/${property.id}/is-favorite`);
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
  }, [user, property]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation(); // Prevent card click from triggering
    e.preventDefault(); // Prevent default link behavior
    if (!user) {
      alert("Please log in to favorite properties.");
      return;
    }
    const newFavoritedState = !isFavorited;
    setIsFavorited(newFavoritedState);

    try {
      const response = await fetch(`/api/properties/${property.id}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  const handleShareClick = (e) => {
    e.stopPropagation(); // Prevent card click from triggering
    e.preventDefault(); // Prevent default link behavior
    if (navigator.share) {
      navigator.share({
        title: property.address,
        text: `Check out this property: ${property.address}`,
        url: `${window.location.origin}/property/${property.id}`,
      })
        .then(() => console.log('Successful share')) // Keep for successful share
        .catch((error) => console.error('Error sharing', error));
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/property/${property.id}`);
      alert('Link copied to clipboard!');
    }
  };



  const handleCardClick = () => {
    if (setSelectedProperty) {
      setSelectedProperty(property);
    }
  };

  // Prefer normalized isAvailable from transformPropertyData when available
  const isAvailable = typeof property?.isAvailable === 'boolean' ? property.isAvailable : Boolean(property?.isActive);

  // --- added: normalize status and map to single class ---
  const rawStatus = property?.MIAMIRE_LastStatus || property?.statusNormalized || '';
  const normalizedStatus = String(rawStatus).trim().charAt(0).toUpperCase() + String(rawStatus).trim().slice(1);
  const statusColorMap = {
    Active: 'bg-green-600',
    Pending: 'bg-yellow-600',
    Inactive: 'bg-gray-500 text-black',
    Sold: 'bg-red-500',
    Closed: 'bg-red-500',
    Withdrawn: 'bg-red-500',
    OffMarket: 'bg-gray-500 text-black',
  };

  const statusClassName = statusColorMap[normalizedStatus] || 'bg-gray-300';

  // Handle image URL properly - check if it's a valid URL or needs processing
  const getImageSrc = () => {
    if (property.image) {
      // If the image URL starts with http/https, use it as is
      if (property.image.startsWith('http://') || property.image.startsWith('https://')) {
        return property.image;
      }
      // If it starts with '/', assume it's a local path
      else if (property.image.startsWith('/')) {
        return property.image;
      }
      // Otherwise, it might be a relative path from the API
      else {
        return property.image;
      }
    }
    return '/images/property1.jpg'; // fallback image
  };

  const imageSrc = getImageSrc();

  return (
    <div className='border h-[400px] rounded-md border-gray-300'>
      <div
        className={`cursor-pointer`}
      >
        <div className="p-2">
          <div className="relative mb-3">
            <div className="relative h-48 bg-gray-300 rounded-lg overflow-hidden">
              <img
                src={imageSrc}
                alt={property.address || 'property image'}
                className="transition-transform w-full h-full duration-300 transform hover:scale-105"
                width={400}
                height={192}
                style={{ objectFit: 'cover' }}
                loading='lazy'
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop if fallback also fails
                  e.target.src = '/images/property1.jpg';
                }}
                unoptimized={true} // This is important for external images
              />

              {normalizedStatus && (
                <div className="absolute top-3 left-3">
                  <span className={`${statusClassName} text-black border border-gray-400 shadow-md text-xs font-bold px-2 py-1 rounded`}>
                    {normalizedStatus}
                  </span>
                </div>
              )}

              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button onClick={handleFavoriteClick} className="w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-md transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105">
                  <FaHeart className={`${isFavorited ? 'text-red-500' : 'text-gray-600'} text-sm`} />
                </button>
                <button onClick={handleShareClick} className="w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-md transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105">
                  <IoMdShare className="text-gray-600 text-sm" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1 flex flex-col justify-between">

            <Headings text={<> $ {property.ListPrice}</>} />
            <div className='flex items-center justify-between text-sm text-gray-600 mt-2 gap-4'>
              <P text={`${property.beds} bd • ${property.baths} ba • ${property.sqft} sqft`} />
              <P text={property.address} />
            </div>
            {/* 
              <div className='flex items-center justify-between text-sm text-gray-600 mt-2'>

                <P text={property?.mls} />
                <P text={property?.logo} />
              </div> */}
            <div className='flex items-center justify-between text-sm text-gray-600 mt-2'>
              {property.yearBuilt > 0 && <P text={`Built: ${property.yearBuilt}`} />}
              {property.lotSize > 0 && <P text={`Lot: ${property.lotSize} Acres`} />}
              {property.type && <P text={`Type: ${property.type}`} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;