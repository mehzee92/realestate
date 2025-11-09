import { FaMapMarkerAlt } from 'react-icons/fa';
import Headings from '../../uis/Headings';
import Button from '../../uis/Button';
import { useState } from 'react';

// Helper function to transform property coordinates for map display
const transformPropertyForMap = (property) => {
  if (!property) return property;
  
  // Create a copy of the property with proper lat/lng fields for the map
  const transformedProperty = { ...property };
  
  // Check if the property has coordinates in the API format (Latitude/Longitude)
  // and convert them to the format expected by the map component (lat/lng)
  if (typeof property.Latitude !== 'undefined' && typeof property.Longitude !== 'undefined') {
    const latValue = property.Latitude || property.latitude;
    const lngValue = property.Longitude || property.longitude;
    
    let lat = parseFloat(latValue);
    if (isNaN(lat)) {
      lat = undefined;
    }
    let lng = parseFloat(lngValue);
    if (isNaN(lng)) {
      lng = undefined;
    }
    
    transformedProperty.lat = lat;
    transformedProperty.lng = lng;
  } else if (typeof property.lat !== 'undefined' && typeof property.lng !== 'undefined') {
    // If the property already has lat/lng in the correct format, use as is
    transformedProperty.lat = parseFloat(property.lat);
    transformedProperty.lng = parseFloat(property.lng);
  }
  
  return transformedProperty;
};

// Helper function to construct the property address
const constructPropertyAddress = (property) => {
  if (!property) return '';
  
  const addressParts = [
    property.UnparsedAddress || null,
    [property.StreetNumber, property.StreetDirPrefix, property.StreetName, property.StreetSuffix].filter(Boolean).join(' '),
    [property.City, property.StateOrProvince, property.PostalCode].filter(Boolean).join(', ')
  ].filter(Boolean);

  return addressParts.join(', ');
};

const Location = ({ property, copyAddress, Map }) => {
  const [isCopied, setIsCopied] = useState(false);

  // Transform the property for map compatibility
  const transformedProperty = transformPropertyForMap(property);
  
  const hasValidCoordinates =
    transformedProperty &&
    typeof transformedProperty.lat === 'number' &&
    isFinite(transformedProperty.lat) &&
    typeof transformedProperty.lng === 'number' &&
    isFinite(transformedProperty.lng);

  // Construct the property address
  const address = constructPropertyAddress(property);

  const handleCopyAddress = () => {
    copyAddress();
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="">
      <Headings text="Location" className={"py-4"}/>

      {/* Address */}
      <div className="flex items-center gap-2 mb-6">
        <FaMapMarkerAlt className="text-gray-500" />
        <span className="text-lg text-gray-700 font-medium">{address}</span>
      </div>

      {/* Real Map */}
      {hasValidCoordinates ? (
        <div className="w-full h-[400px] rounded-lg mb-6 relative overflow-hidden">
          <Map properties={[transformedProperty]} />
        </div>
      ) : (
        <div className="w-full h-[400px] rounded-lg mb-6 relative overflow-hidden flex items-center justify-center bg-gray-200">
          <p className="text-gray-500">Map data not available for this property.</p>
        </div>
      )}

      {/* Copy address button */}
      <Button
        onClick={handleCopyAddress}
      >
        {isCopied ? 'Copied!' : 'Copy address'}
      </Button>
    </div>
  );
};

export default Location;