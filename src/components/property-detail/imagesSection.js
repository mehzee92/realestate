"use client"
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import {  FaHeart } from 'react-icons/fa'
import { IoMdShare } from "react-icons/io";

function ImagesSection({ galleryImages, property, openCarousel }) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [user, setUser] = useState(null);

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

    const handleFavoriteClick = async () => {
        if (!user) {
            // Or redirect to login
            alert("Please log in to favorite properties.");
            return;
        }
        const newFavoritedState = !isFavorited;
        setIsFavorited(newFavoritedState);

        try {
            // Mock API call
            const response = await fetch(`/api/properties/${property.id}/favorite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ favorited: newFavoritedState }),
            });

            if (!response.ok) {
                // Revert state if API call fails
                setIsFavorited(!newFavoritedState);
                throw new Error('Failed to update favorite status');
            }

            // console.log(`Property ${newFavoritedState ? 'favorited' : 'unfavorited'}`);
        } catch (error) {
            console.error(error);
            // Optionally show an error message to the user
        }
    };

    const handleShareClick = () => {
        if (navigator.share) {
            navigator.share({
                title: property.address,
                text: `Check out this property: ${property.address}`,
                url: window.location.href,
            })
                .then(() => console.log('Successful share')) // Keep for successful share
                .catch((error) => console.error('Error sharing', error));
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleMoreClick = () => {
        // Implement more options logic, e.g., a dropdown menu

    };


    const selectedImages = galleryImages.slice(1, 5); // Extract the first 4 images from galleryImages
    const gridClasses = () => {
        const count = selectedImages.length;
        if (count === 0) return '';
        if (count === 1) return 'grid-cols-1 grid-rows-1';
        if (count === 2) return 'grid-cols-1 grid-rows-2';
        if (count === 3) return 'grid-cols-2 grid-rows-2';
        return 'grid-cols-2 grid-rows-2';
    };

    return (
        <div>{/* Image Gallery Section */}
            <div className="relative">
                <div className="flex flex-col md:flex-row w-[90%] m-auto rounded-2xl overflow-hidden gap-1 md:h-[60vh]">
                    {/* Main Large Image */}
                    <div className="w-full h-full relative cursor-pointer" onClick={() => openCarousel(0)}>
                        <img
                            src={galleryImages?.[0] || property.image || '/images/property1.jpg'}
                            alt={property.address}
                            className="object-cover h-full w-full"
                            loading="lazy"
                        />
                    </div>

                    {/* Image Grid */}
                   {selectedImages.length > 0 && <div className="w-full h-full relative ">
                        <div className={`grid ${gridClasses()} gap-1 h-full`}>
                            {selectedImages.map((image, index) => (
                                <div key={index} className={`relative w-full h-full overflow-hidden cursor-pointer ${selectedImages.length === 3 && index === 0 ? 'row-span-2' : ''}`} onClick={() => openCarousel(index + 1)}>
                                    <img
                                        src={image || '/images/property1.jpg'}
                                        alt={`Property image ${index + 1}`}
                                        loading='lazy'
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>}
                     {/* All Photos Button */}
                        <div className="absolute bottom-2 right-[6%]">
                            <button
                                onClick={() => openCarousel(0)}
                                className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 font-semibold px-3 py-1 rounded-lg text-sm transition-all duration-200 shadow-md cursor-pointer hover:shadow-lg"
                            >
                                All photos
                            </button>
                        </div>
                    {/* Action Icons */}
                        <div className="absolute top-3 right-10 md:right-[7%] flex flex-col gap-2">
                            
                            <button onClick={handleFavoriteClick} className="w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-md transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105">
                                <FaHeart className={`${isFavorited ? 'text-red-500' : 'text-gray-600'} text-sm`} />
                            </button>
                            <button onClick={handleShareClick} className="w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-md transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105">
                                <IoMdShare className="text-gray-600 text-sm" />
                            </button>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default ImagesSection