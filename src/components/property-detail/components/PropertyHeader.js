import PriceDisplay from '@/components/uis/PriceDisplay';
import AddressDisplay from '@/components/uis/AddressDisplay';
import PropertyStats from '@/components/uis/PropertyStats';
import StandardStatusDisplay from '@/components/uis/StandardStatusDisplay';
import PropertyInfoCard from '@/components/uis/PropertyInfoCard';
import PricePerSqft from '@/components/uis/PricePerSqft';
import IconCard from '@/components/uis/IconCard';
import { FaRulerCombined, FaCalendarAlt } from 'react-icons/fa';
import { FaCarTunnel } from 'react-icons/fa6';

const PropertyHeader = ({ property }) => {
  // Build address from raw API data
  const streetLine = [
    property?.StreetNumber,
    property?.StreetDirPrefix,
    property?.StreetName,
    property?.StreetSuffix,
  ]
    .filter(Boolean)
    .join(' ');
  const cityLine = [
    property?.City,
    property?.StateOrProvince,
    property?.PostalCode,
  ]
    .filter(Boolean)
    .join(' ');
  const address = [streetLine, cityLine].filter(Boolean).join(', ');
  const pricePerSqft = property.LivingArea > 0 ? (Number(property.ListPrice || 0) / property.LivingArea).toFixed(2) : null;

  return (
    <div className="">
      {/* Price */}
      <div className="mb-4">
        <div className='flex flex-wrap justify-between'>
          <div className='space-y-2'>
            <PriceDisplay price={property.ListPrice} />
            <AddressDisplay address={address} unparsedAddress={property.UnparsedAddress} />
          </div>

          {/* Beds, Baths, Sqft */}
          <PropertyStats 
            bedrooms={property.BedroomsTotal} 
            bathrooms={property.BathroomsTotalDecimal} 
            livingArea={property.LivingArea} 
          />
        </div>
      </div>

      {/* Standard Status */}
      <StandardStatusDisplay status={property.StandardStatus} />
      
      {/* Additional Property Info */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Property Type */}
        <PropertyInfoCard 
          icon={
            <svg viewBox="0 0 32 32"
              aria-hidden="true"
              focusable="false"
              role="img"
              className="h-5 w-5">
              <g stroke="none">
                <path d="M28.34 7.06l-14-5a1 1 0 00-.92.12A1 1 0 0013 3v13.35l-2.33-2.09a1 1 0 00-1.34 0l-5.82 5.22A1.55 1.55 0 003 20.62v8.11A1.27 1.27 0 004.27 30H28a1 1 0 001-1V8a1 1 0 00-.66-.94zM11 28H9v-3h2zm4 0h-2v-3.5a1.5 1.5 0 00-1.5-1.5h-3A1.5 1.5 0 007 24.5V28H5v-7.17l5-4.49 5 4.49zm12 0H17v-7.38a1.55 1.55 0 00-.51-1.14L15 18.12V4.42l12 4.29z"></path><path d="M24 13v10a1 1 0 01-2 0V13a1 1 0 012 0zM20 11v12a1 1 0 01-2 0V11a1 1 0 012 0z"></path></g>
            </svg>
          }
          text={property.PropertyType || '--'}
        />

        {/* Built Year */}
        <PropertyInfoCard 
          icon={
            <svg
              viewBox="0 0 32 32"
              aria-hidden="true"
              focusable="false"
              role="img"
              className="h-5 w-5">
              <g stroke="none"><path d="M15.48 25a1 1 0 001 1 1 1 0 10-1-1z"></path><path d="M28.38 6a5 5 0 00-4-2h-.58A3 3 0 0021 2h-9a3 3 0 00-3 3h-.06a2.52 2.52 0 00-2.46-2h-1A2.51 2.51 0 003 5.51v5A2.52 2.52 0 005.52 13h1a2.52 2.52 0 002.46-2H9a3 3 0 003 3h.88L12 25.35v.16a4.4 4.4 0 002.54 4.07A4.53 4.53 0 0021 25.5v-.15L20.12 14H21a3 3 0 003-3v-1h.67l.8.26a2.49 2.49 0 00.85.14A2.69 2.69 0 0029 8.16 2.81 2.81 0 0028.38 6zM19 25.5a2.5 2.5 0 11-5 0l.87-11.5h3.22zm7.3-17.1h-.23l-.79-.27a1.93 1.93 0 00-.63-.1H23a1 1 0 00-1 1v2a1 1 0 01-1 1h-9a1 1 0 01-1-1V10a1 1 0 00-1-1H8a1 1 0 00-1 1v.48a.52.52 0 01-.52.52h-1a.52.52 0 01-.48-.52v-5A.52.52 0 015.52 5h1a.52.52 0 01.48.52V6a1 1 0 001 1h2a1 1 0 001-1V5a1 1 0 011-1h9a1 1 0 011 1 1 1 0 001 1h1.39a3 3 0 012.49 1.34.68.68 0 01-.58 1.06z"></path></g>
            </svg>
          }
          text={`Built in ${property.YearBuilt || '--'}`}
        />

        {/* Lot Size */}
        <PropertyInfoCard 
          icon={
            <svg
              viewBox="0 0 32 32"
              aria-hidden="true"
              focusable="false"
              role="img"
              className="h-5 w-5">
              <path stroke="none" d="M30.9 26.4l-5.6-8a1 1 0 00-.8-.4H13v-2a4.7 4.7 0 004-4.5 4.3 4.3 0 00-1.6-3.3 4 4 0 10-6.8 0A4.3 4.3 0 007 11.5a4.7 4.7 0 004 4.4V18H7.5a1 1 0 00-.8.4l-5.6 8a1 1 0 00.8 1.6h28.2a1 1 0 00.8-1.6zM9 11.5a2.3 2.3 0 011-1.8 2 2 0 00.3-2.6A2 2 0 0110 6a2 2 0 014 0 2 2 0 01-.3 1 2 2 0 00.4 2.7 2.3 2.3 0 01.9 1.8 2.6 2.6 0 01-2 2.4V11a1 1 0 00-2 0v2.9a2.6 2.6 0 01-2-2.4zM3.8 26L8 20h3v2a1 1 0 002 0v-2h11l4.2 6z"></path>
            </svg>
          }
          text={property.LotSizeAcres ? `${property.LotSizeAcres} Acres` : '-- Acres'}
        />

        {/* Price Per Sqft */}
        <PricePerSqft pricePerSqft={pricePerSqft} />

        {/* HOA Fees */}
        <PropertyInfoCard 
          icon={
            <svg
              viewBox="0 0 32 32"
              aria-hidden="true"
              focusable="false"
              role="img"
              className="w-5 h-5">
              <g stroke="none"><path d="M21.65 6.47l-5-4.23a1 1 0 00-1.3 0l-5 4.23a1 1 0 00-.35.76v6.27a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5V7.23a1 1 0 00-.35-.76zM20 13h-3v-2a1 1 0 00-2 0v2h-3V7.69l4-3.38 4 3.38z"></path><path d="M14.31 20.81l-3.94-4.75-.09-.1A2.91 2.91 0 008 15.2v-2.7C8 9.92 6.38 9 5 9s-3 1.08-3 3.5v7.2a3.74 3.74 0 00.82 2.3L7 27.25V29a1 1 0 001 1h6a1 1 0 001-1v-6.28a3 3 0 00-.69-1.91zM13 28H9v-1.1a1 1 0 00-.22-.62l-4.4-5.51A1.67 1.67 0 014 19.7v-7.2c0-.68.17-1.5 1-1.5.25 0 1 0 1 1.5v3.85A3 3 0 006.23 20l3 3.6a1 1 0 001.54-1.28l-3-3.64a1 1 0 01-.06-1.28.86.86 0 011.2 0l3.89 4.68a1 1 0 01.23.64zM27 9c-1.38 0-3 .92-3 3.5v2.69a2.93 2.93 0 00-2.28.77l-.09.1-3.94 4.75a3 3 0 00-.69 1.91V29a1 1 0 001 1h6a1 1 0 001-1v-1.75L29.18 22a3.74 3.74 0 00.82-2.3v-7.2c0-2.42-1.51-3.5-3-3.5zm1 10.7a1.71 1.71 0 01-.38 1.08l-4.4 5.5a1 1 0 00-.22.62V28h-4v-5.28a1 1 0 01.23-.64l3.89-4.68a.84.84 0 011.14 0 1 1 0 010 1.38l-3 3.6a1 1 0 101.54 1.28l3-3.56a3 3 0 00.2-3.73V12.5c0-1.5.75-1.5 1-1.5.83 0 1 .82 1 1.5z"></path></g>
            </svg>
          }
          text={`${property.AssociationFee ? Math.round(property.AssociationFee).toLocaleString() : '1,093'}/mo HOA`}
        />

        {/* Garage Spaces */}
        {property.GarageSpaces > 0 && (
          <IconCard 
            icon={FaCarTunnel}
            text={`${property.GarageSpaces} Garage Spaces`}
            size={24}
          />
        )}

        {/* Living Area */}
        {property.LivingArea > 0 && (
          <IconCard 
            icon={FaRulerCombined}
            text={`${property.LivingArea.toLocaleString()} sqft`}
            size={16}
          />
        )}

        {/* Days on Market */}
        {property.DaysOnMarket > 0 && (
          <IconCard 
            icon={FaCalendarAlt}
            text={`${property.DaysOnMarket} Days on Market`}
            size={16}
          />
        )}
      </div>
    </div>
  );
};

export default PropertyHeader;