"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';

const ImageCarousel = ({ images, startIndex = 0, onClose, propertyId }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [apiImages, setApiImages] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch images from API using propertyId if images are not provided
  const fetchImagesFromApi = useCallback(async () => {
    if (!propertyId || images) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/properties/${propertyId}`);
      if (response.ok) {
        const propertyData = await response.json();
        if (propertyData.Media && Array.isArray(propertyData.Media)) {
          const imageUrls = propertyData.Media.map(media => media.MediaURL).filter(Boolean);
          setApiImages(imageUrls);
        }
      }
    } catch (error) {
      console.error('Error fetching property images:', error);
    } finally {
      setLoading(false);
    }
  }, [propertyId, images]);

  // Fetch images when component mounts if we have a propertyId but no images
  useEffect(() => {
    if (!images && propertyId) {
      fetchImagesFromApi();
    }
  }, [images, propertyId, fetchImagesFromApi]);

  // Use provided images or fallback to API fetched images
  const displayImages = images || apiImages || [];

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1));
  }, [displayImages.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1));
  }, [displayImages.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToPrevious, goToNext, onClose]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="text-white text-xl">Loading images...</div>
      </div>
    );
  }

  if (!displayImages || displayImages.length === 0) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-[90vw] h-[90vh] md:w-[90vw] md:h-[90vh] lg:w-[80vw] lg:h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 md:top-5 md:-right-10 text-white hover:text-gray-300 text-3xl z-10 transition-transform duration-200 transform hover:scale-110"
          aria-label="Close slideshow"
        >
          <FaTimes />
        </button>

        {/* Image Container */}
        <div className="relative w-full h-full">
          {displayImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img 
                src={image} 
                alt={`Property image ${index + 1}`}
                style={{ objectFit: 'contain' }}
                className="rounded-lg w-full h-full"
                loading='lazy'
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = '/images/property1.jpg'; // fallback image
                }}
              />
            </div>
          ))}
        </div>

        {/* Prev Button */}
        <button 
          onClick={goToPrevious} 
          className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/50 p-3 rounded-full transition-transform duration-200 transform hover:scale-105"
          aria-label="Previous image"
        >
          <FaArrowLeft color='#000'/>
        </button>

        {/* Next Button */}
        <button 
          onClick={goToNext} 
          className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/50 p-3 rounded-full transition-transform duration-200 transform hover:scale-105"
          aria-label="Next image"
        >
          <FaArrowRight color='#000'/>
        </button>
        
        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
          {currentIndex + 1} / {displayImages.length}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
