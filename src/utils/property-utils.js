export const transformPropertyData = (item) => {

  const listPriceNumber = parseFloat(String(item?.ListPrice || '0').replace(/[^0-9.-]+/g, ''));
  const formattedPrice = listPriceNumber
    ? `$${listPriceNumber.toLocaleString()}`
    : 'N/A';

  const streetLine = [
    item?.StreetNumber,
    item?.StreetDirPrefix,
    item?.StreetName,
    item?.StreetSuffix,
  ]
    .filter(Boolean)
    .join(' ');
  const cityLine = [
    item?.City,
    item?.StateOrProvince,
    item?.PostalCode,
  ]
    .filter(Boolean)
    .join(' ');
  const address = [streetLine, cityLine].filter(Boolean).join(', ');

  const livingArea = Number(item?.LivingArea || 0);
  const sqft = livingArea ? livingArea.toLocaleString() : '-';

  const latValue = item?.Latitude || item?.latitude;
  const lngValue = item?.Longitude || item?.longitude;

  let lat = parseFloat(latValue);
  if (isNaN(lat)) {
    lat = undefined;
  }
  let lng = parseFloat(lngValue);
  if (isNaN(lng)) {
    lng = undefined;
  }

  if ((lat === undefined || lng === undefined) && Array.isArray(item?.Coordinates) && item.Coordinates.length === 2) {
    if (lat === undefined && typeof item.Coordinates[1] === 'number') lat = item.Coordinates[1];
    if (lng === undefined && typeof item.Coordinates[0] === 'number') lng = item.Coordinates[0];
  }

  // Process Media field from API response - handle different possible structures
  let imageUrl = '/images/property1.jpg'; // Default fallback
  let galleryImages = [];
  
  if (item?.Media) {
    // The Media field might be an array of objects or a single object
    let mediaArray = [];
    
    if (Array.isArray(item.Media)) {
      mediaArray = item.Media;
    } else if (typeof item.Media === 'object' && item.Media !== null) {
      // If Media is a single object, wrap it in an array
      mediaArray = [item.Media];
    }
    
    // Look for the first valid MediaURL for the main image
    for (let i = 0; i < mediaArray.length; i++) {
      const media = mediaArray[i];
      
      // Media might have different structures depending on the API response
      let mediaUrl = null;
      
      if (media && typeof media === 'object') {
        // Try different possible property names for the URL
        mediaUrl = media.MediaURL || media.url || media.href || media['@id'] || media['@odata.id'];
      } else if (typeof media === 'string') {
        // Media might be a string URL directly
        mediaUrl = media;
      }
      
      if (mediaUrl && typeof mediaUrl === 'string') {
        // Check if the URL is valid before using it
        if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
          imageUrl = mediaUrl;
          break; // Use the first valid image as the main image
        }
      }
    }
    
    // Prepare gallery images with all valid URLs
    for (let i = 0; i < mediaArray.length; i++) {
      const media = mediaArray[i];
      
      let mediaUrl = null;
      if (media && typeof media === 'object') {
        mediaUrl = media.MediaURL || media.url || media.href || media['@id'] || media['@odata.id'];
      } else if (typeof media === 'string') {
        mediaUrl = media;
      }
      
      if (mediaUrl && typeof mediaUrl === 'string' && 
          (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://'))) {
        galleryImages.push(mediaUrl);
      }
    }
  }
  
  // Skip transforming if the property is sold or unavailable
  const status = (item?.StandardStatus || '').toString().trim();
  if (/\b(sold|closed|withdrawn|cancelled|expired|offmarket)\b/i.test(status)) {
    return null; // Return null to indicate this property should be filtered out
  }
  
  if (!item?.ListingId) {
    return null; // Return null if ListingId is missing
  }

  // Create a new object with only the essential fields needed for the application
  const transformedProperty = {
    id: item.ListingId, // Always use ListingId
    ListingId: item?.ListingId,
    ListPrice: listPriceNumber, // Ensure ListPrice is a number
    updatedAt: item?.ModificationTimestamp || Date.now(),
    // Preserve original status and add a normalized availability flag
    listingStatus: item?.StandardStatus || 'Active',
    statusNormalized: (item?.StandardStatus || '').toString().trim().toLowerCase(),
    // Compute isAvailable: treat these as unavailable
    isAvailable: !( /\b(sold|closed|withdrawn|cancelled|expired|offmarket)\b/i.test(item?.StandardStatus || '') ),
    beds: item?.BedroomsTotal ?? 0,
    baths: item?.BathroomsTotalInteger ?? 0,
    sqft,
    address,
    mls: item?.ListingId ? `MLS®: ${item.ListingId}` : 'MLS®: N/A',
    image: imageUrl,
    galleryImages: galleryImages,
    isActive: true,
    logo: 'Bridge MLS',
    lat,
    lng,
    description: item?.PublicRemarks || '',
    yearBuilt: item?.YearBuilt ?? 0,
    parking: '',
    price: formattedPrice, // Add the formatted price
    hoa: item?.AssociationFee
      ? `${Number(item.AssociationFee).toLocaleString()}/month`
      : 'None',
    type: typeof item?.PropertyType === 'string' 
      ? item.PropertyType.toLowerCase().replace(/[^a-z0-9]/g, '') 
      : 'mls',
    // Assuming item.ListingCategory or similar exists for 'sale'/'rent' distinction
    // If not, this filter will not work correctly without further API info.
    listingCategory: (item?.PropertyType === 'Residential Lease' || item?.PropertyType === 'residentiallease') ? 'For Rent' : 'For Sale',
    daysOnMarket: 0,
    squareFeet: livingArea || 0,
    lotSize: Number(item?.LotSizeAcres || 0),
    garageSpaces: Number(item?.GarageSpaces || 0),
    features: [],
    associationFee: item?.AssociationFee
      ? `${Number(item.AssociationFee).toLocaleString()}/month`
      : 'None',
    // Preserve essential original fields that might be needed later
    UnparsedAddress: item?.UnparsedAddress,
    StreetNumber: item?.StreetNumber,
    StreetDirPrefix: item?.StreetDirPrefix,
    StreetName: item?.StreetName,
    StreetSuffix: item?.StreetSuffix,
    City: item?.City,
    StateOrProvince: item?.StateOrProvince,
    PostalCode: item?.PostalCode,
    BedroomsTotal: item?.BedroomsTotal,
    BathroomsTotalInteger: item?.BathroomsTotalInteger,
    LivingArea: item?.LivingArea,
    LotSizeAcres: item?.LotSizeAcres,
    YearBuilt: item?.YearBuilt,
    GarageSpaces: item?.GarageSpaces,
    Media: item?.Media,
    StandardStatus: item?.StandardStatus,
    PublicRemarks: item?.PublicRemarks,
    PropertyType: item?.PropertyType,
    PropertySubType: item?.PropertySubType,
    AssociationFee: item?.AssociationFee,
    DaysOnMarket: item?.DaysOnMarket,
    ModificationTimestamp: item?.ModificationTimestamp,
    MIAMIRE_LastStatus: item?.MIAMIRE_LastStatus,
  };
  
  return transformedProperty;
};