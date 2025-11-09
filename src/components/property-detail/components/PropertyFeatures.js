import React from 'react';

const PropertyFeatures = ({ property = {} }) => {
  const formatValue = (val) => {
    if (val === null || val === undefined) return null;
    if (Array.isArray(val)) {
      const filteredArray = val.filter(item => item && item !== 'N/A' && item !== 'null' && item !== 'undefined');
      return filteredArray.length > 0 ? filteredArray.join(', ') : null;
    }
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (typeof val === 'number' && isNaN(val)) return null;
    if (val === 'N/A' || val === 'null' || val === 'undefined' || val === '') return null;
    return val;
  };

  const formatCurrency = (val) => {
    if (!val) return null;
    return `$${Number(val).toLocaleString()}`;
  };

  const formatSquareFeet = (val) => {
    if (!val) return null;
    return `${Number(val).toLocaleString()} sqft`;
  };

  const features = {
    Interior: {
      'Bedrooms & bathrooms': [
        { label: 'Bedrooms', value: property.BedroomsTotal },
        { label: 'Bathrooms', value: property.BathroomsTotalInteger },
        { label: 'Full bathrooms', value: property.BathroomsFull },
        { label: 'Half bathrooms', value: property.BathroomsHalf },
      ],
      Appliances: [
        { label: 'Included', value: formatValue(property.Appliances) },
        { label: 'Laundry', value: formatValue(property.LaundryFeatures) },
      ],
      Flooring: [
        { label: 'Flooring', value: formatValue(property.Flooring) },
      ],
      Heating: [
        { label: 'Heating', value: formatValue(property.Heating) },
      ],
      Cooling: [
        { label: 'Cooling', value: formatValue(property.Cooling) },
      ],
      'Interior features': [
        { label: 'Interior features', value: formatValue(property.InteriorFeatures) },
        { label: 'Door features', value: formatValue(property.DoorFeatures) },
        { label: 'Window features', value: formatValue(property.WindowFeatures) },
        { label: 'Fireplace', value: formatValue(property.FireplaceYN) },
        { label: 'Fireplace features', value: formatValue(property.FireplaceFeatures) },
      ],
      'Room features': [
        { label: 'Bedroom features', value: formatValue(property.RoomBedroomFeatures) },
        { label: 'Dining room features', value: formatValue(property.RoomDiningRoomFeatures) },
        { label: 'Living room features', value: formatValue(property.RoomLivingRoomFeatures) },
        { label: 'Master bathroom features', value: formatValue(property.RoomMasterBathroomFeatures) },
      ],
      'Interior area': [
        { label: 'Living area', value: property.LivingArea ? formatSquareFeet(property.LivingArea) : null },
        { label: 'Living area units', value: property.LivingAreaUnits },
      ],
      'Video & virtual tour': [
        { label: 'Virtual tour', value: property.VirtualTourURLUnbranded, isLink: true },
      ],
    },
    Property: {
      Parking: [
        { label: 'Parking total', value: property.ParkingTotal },
        { label: 'Garage spaces', value: property.GarageSpaces },
        { label: 'Carport spaces', value: property.CarportSpaces },
        { label: 'Parking features', value: formatValue(property.ParkingFeatures) },
        { label: 'Other equipment', value: formatValue(property.OtherEquipment) },
      ],
      'Lot details': [
        { label: 'Lot size acres', value: property.LotSizeAcres },
        { label: 'Lot size square feet', value: property.LotSizeSquareFeet },
        { label: 'Lot size units', value: property.LotSizeUnits },
        { label: 'Lot features', value: formatValue(property.LotFeatures) },
        { label: 'Fencing', value: formatValue(property.Fencing) },
        { label: 'Vegetation', value: formatValue(property.Vegetation) },
      ],
      'Exterior features': [
        { label: 'Exterior features', value: formatValue(property.ExteriorFeatures) },
        { label: 'Patio and porch features', value: formatValue(property.PatioAndPorchFeatures) },
        { label: 'Other structures', value: formatValue(property.OtherStructures) },
      ],
      'Waterfront & water view': [
        { label: 'Waterfront', value: formatValue(property.WaterfrontYN) },
        { label: 'Waterfront features', value: formatValue(property.WaterfrontFeatures) },
        { label: 'View', value: formatValue(property.View) },
      ],
      'Home details': [
        { label: 'Property type', value: property.PropertyType },
        { label: 'Property sub type', value: property.PropertySubType },
        { label: 'Architectural style', value: formatValue(property.ArchitecturalStyle) },
        { label: 'Building name', value: property.BuildingName },
        { label: 'Stories total', value: property.StoriesTotal },
        { label: 'Entry level', value: property.EntryLevel },
        { label: 'Property attached', value: formatValue(property.PropertyAttachedYN) },
      ],
    },
    Construction: {
      'Type & style': [
        { label: 'Structure type', value: formatValue(property.StructureType) },
        { label: 'New construction', value: formatValue(property.NewConstructionYN) },
      ],
      Materials: [
        { label: 'Construction materials', value: formatValue(property.ConstructionMaterials) },
        { label: 'Roof', value: formatValue(property.Roof) },
        { label: 'Foundation', value: formatValue(property.FoundationDetails) },
      ],
      Condition: [
        { label: 'Year built', value: property.YearBuilt },
        { label: 'Year built details', value: property.YearBuiltDetails },
        { label: 'Property condition', value: formatValue(property.PropertyCondition) },
      ],
      'Utilities & green energy': [
        { label: 'Gas', value: formatValue(property.Gas) },
        { label: 'Sewer', value: formatValue(property.Sewer) },
        { label: 'Water source', value: formatValue(property.WaterSource) },
        { label: 'Utilities', value: formatValue(property.Utilities) },
        { label: 'Green energy efficient', value: formatValue(property.GreenEnergyEfficient) },
        { label: 'Green energy generation', value: formatValue(property.GreenEnergyGeneration) },
      ],
    },
    'Community & HOA': {
      Community: [
        { label: 'Community features', value: formatValue(property.CommunityFeatures) },
        { label: 'Security features', value: formatValue(property.SecurityFeatures) },
        { label: 'Subdivision name', value: property.SubdivisionName },
        { label: 'Number of units in community', value: property.NumberOfUnitsInCommunity },
      ],
      HOA: [
        { label: 'Association', value: formatValue(property.AssociationYN) },
        { label: 'Association fee', value: property.AssociationFee ? formatCurrency(property.AssociationFee) : null },
        { label: 'Association fee frequency', value: property.AssociationFeeFrequency },
        { label: 'Association amenities', value: formatValue(property.AssociationAmenities) },
        { label: 'Maintenance includes', value: formatValue(property.MIAMIRE_MaintenanceIncludes) },
      ],
      Pets: [
        { label: 'Pets allowed', value: formatValue(property.PetsAllowed) },
      ],
      Location: [
        { label: 'County or parish', value: property.CountyOrParish },
        { label: 'MLS area major', value: property.MLSAreaMajor },
        { label: 'Directions', value: property.Directions },
      ],
      Schools: [
        { label: 'Elementary school', value: property.ElementarySchool },
        { label: 'Middle or junior school', value: property.MiddleOrJuniorSchool },
        { label: 'High school', value: property.HighSchool },
      ],
    },
    'Financial & listing details': {
      'Tax details': [
        { label: 'Tax annual amount', value: property.TaxAnnualAmount ? formatCurrency(property.TaxAnnualAmount) : null },
        { label: 'Tax year', value: property.TaxYear },
        { label: 'Tax lot', value: property.TaxLot },
        { label: 'Tax legal description', value: property.TaxLegalDescription },
      ],
      'Listing details': [
        { label: 'List price', value: property.ListPrice ? formatCurrency(property.ListPrice) : null },
        { label: 'Original list price', value: property.OriginalListPrice ? formatCurrency(property.OriginalListPrice) : null },
        { label: 'Listing terms', value: formatValue(property.ListingTerms) },
        { label: 'Possession', value: formatValue(property.Possession) },
        { label: 'Listing agreement', value: property.ListingAgreement },
        { label: 'On market date', value: property.OnMarketDate },
        { label: 'Days on market', value: property.DaysOnMarket },
        { label: 'Standard status', value: property.StandardStatus },
        { label: 'Mls status', value: property.MlsStatus },
      ],
    },
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Facts & features</h2>
      {Object.entries(features).map(([category, subCategories]) => (
        <div key={category} className="mb-6">
          <div className="bg-gray-100 p-4">
            <h3 className="text-xl font-semibold text-gray-800">{category}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 p-4">
            {Object.entries(subCategories).map(([subCategory, items]) => {
              const visibleItems = items.filter(item => {
                if (item.value === null || item.value === undefined || item.value === '') return false;
                if (Array.isArray(item.value) && item.value.length === 0) return false;
                return true;
              });

              if (visibleItems.length === 0) {
                return null;
              }

              return (
                <div key={subCategory} className="mb-4">
                  <p className="font-bold text-gray-700 text-lg mb-2">{subCategory}</p>
                  <ul className="ml-4">
                    {visibleItems.map((item, index) => (
                      <li key={index} className="list-disc font-semibold text-md text-gray-700 mb-1">
                        {item.label}: <span className="font-normal text-sm ml-2 text-gray-900">
                        {item.isLink ? (
                          <a href={item.value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            View virtual tour
                          </a>
                        ) : (
                            item.value
                        )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyFeatures;