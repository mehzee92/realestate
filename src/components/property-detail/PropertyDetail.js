"use client";
import { useState, useEffect } from 'react';
import ImageCarousel from '@/components/property-detail/ImageCarousel';
import ImagesSection from '@/components/property-detail/imagesSection';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';


const GoogleMap = dynamic(() => import('@/components/home-search/GoogleMap'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

import PropertyHeader from '@/components/property-detail/components/PropertyHeader';


import Overview from '@/components/property-detail/components/Overview';
import Location from '@/components/property-detail/components/Location';
import AgentInfo from '@/components/property-detail/components/AgentInfo';
import MortgageCalculator from '@/components/property-detail/components/MortgageCalculator';
import PropertyFeatures from '@/components/property-detail/components/PropertyFeatures';
import Button from '@/components/uis/Button';

const PropertyDetail = ({ property }) => {
  const [showCarousel, setShowCarousel] = useState(false);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const id = property?.ListingId;
  const router = useRouter();
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.isAuthenticated && data.user.role === 'admin') {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user status', error);
      }
    };
    fetchUserStatus();
  }, []);

  if (!property) {
    return <p>Property not found.</p>;
  }


  // Use MLS gallery images if available, otherwise use fallbacks
  const galleryImages = property.Media?.map(media => media.MediaURL).filter(Boolean) || [];
  const mainImage = property.Media?.[0]?.MediaURL || '/images/property1.jpg';

  // Ensure no duplicate images and filter out falsy values
  const allImages = Array.from(new Set([mainImage, ...galleryImages].filter(Boolean)));

  const openCarousel = (index) => {
    setCarouselStartIndex(index);
    setShowCarousel(true);
  };

  const closeCarousel = () => {
    setShowCarousel(false);
  };

  const copyAddress = () => {
    const address = property.UnparsedAddress || 
      [property.StreetNumber, property.StreetDirPrefix, property.StreetName, property.StreetSuffix, property.City, property.StateOrProvince, property.PostalCode]
        .filter(Boolean)
        .join(' ');
    navigator.clipboard.writeText(address);
    // You could add a toast notification here
  };

  const fullDescription = property.PublicRemarks || `Nestled within the highly sought-after community, this expansive and sun-drenched ${property.BedroomsTotal || 0}-bedroom, ${property.BathroomsTotalDecimal || 0}-bathroom residence offers the perfect blend of comfort and sophistication. With its generous open-plan living spaces, soaring ceilings, and abundant natural light, the home effortlessly transitions to a charming outdoor patio, creating a seamless connection between indoor and outdoor living. The thoughtfully designed floorplan is ideal for both relaxed living and effortless entertaining, featuring a gourmet kitchen with premium appliances, a spacious master suite with an ensuiant bathroom, and additional bedrooms that provide flexibility for family needs or home office space. The property's prime location offers easy access to local amenities, schools, and recreational facilities, making it an ideal choice for families seeking both comfort and convenience in a vibrant community setting.`;

  const truncatedDescription = fullDescription.substring(0, 300) + '...';

  return (
    <>
      <div className=" bg-white">
        <div className="mx-auto py-8">
          <div className="">
            {/* Keep original images section */}
            <ImagesSection
              images={allImages}
              openCarousel={openCarousel}
              galleryImages={galleryImages}
              property={property}
            />

            {/* Details Section */}
            <div className="w-[90%] m-auto py-8 flex flex-col lg:flex-row gap-8">
              {/* Left side */}
              <div className="flex-1 space-y-6">
                {/* Main Property Info */}
             
                  <PropertyHeader property={property} />
                {/* Overview Section */}
                  <Overview fullDescription={fullDescription} truncatedDescription={truncatedDescription} showFullDescription={showFullDescription} setShowFullDescription={setShowFullDescription} property={property} />
                {/* Property Features Section */}
            
                  <PropertyFeatures property={property} />
  
                {/* Location Section */}
                  <Location property={property} copyAddress={copyAddress} Map={GoogleMap} />
   
                {/* Financials Section */}
                  <MortgageCalculator property={property} />
              </div>

              <AgentInfo property={property} />
            </div>
          </div>
        </div>
        <div className='py-5 w-full mb-20 flex justify-center items-center'>
          {isAdmin && <Button
            onClick={() => router.push(`/admin/property-contact/${id}`)}
          >
            View Property Contact Details
          </Button>}
        </div>
      </div>

      {showCarousel && (
        <ImageCarousel
          images={allImages}
          startIndex={carouselStartIndex}
          onClose={closeCarousel}
          propertyId={id}
        />
      )}
    </>
  );
};

export default PropertyDetail;