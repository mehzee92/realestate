import { NextResponse } from "next/server";
import { makeApiCall } from "../../../utils/api-utils";
import { sampleProperties } from "../../../data/properties-data";

const DATASET = process.env.MLS_DATASET || "miamire"; // change if needed
const TOKEN = process.env.MLS_API_TOKEN || "088f263ee8c491d93e778f1f48283f4a"; // server token

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = Math.min(parseInt(searchParams.get("limit")) || 200, 200); // Cap at 200 per request to improve loading
    const search = searchParams.get("search");
    const propertyIdsParam = searchParams.get("propertyIds");

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    let bounds;
    try {
      const boundsParam = searchParams.get("bounds");
      if (boundsParam) {
        bounds = JSON.parse(boundsParam);
      }
    } catch (e) {
      console.error("Failed to parse bounds:", e);
    }

    // If we have bounds, use the API; otherwise, use fallback data
    // For development or when API is failing, use sample data
    const useSampleData = !process.env.MLS_API_TOKEN || process.env.MLS_API_TOKEN === "088f263ee8c491d93e778f1f48283f4a";

    if (useSampleData) {
      // Return sample data if no token is configured
      console.log("Using sample properties data");
      
      // Apply bounds filter to sample data if provided
      let filteredSampleProperties = [...sampleProperties];
      
      if (bounds) {
        filteredSampleProperties = filteredSampleProperties.filter(property => 
          property.Latitude > bounds.south && 
          property.Latitude < bounds.north && 
          property.Longitude > bounds.west && 
          property.Longitude < bounds.east
        );
      }
      
      // Apply search filter if provided
      if (search) {
        filteredSampleProperties = filteredSampleProperties.filter(property => 
          property.UnparsedAddress.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply pagination
      const paginatedProperties = filteredSampleProperties.slice(skip, skip + limit);

      // Add pagination metadata
      const paginationInfo = {
        page,
        limit,
        skip,
        hasNextPage: (skip + limit) < filteredSampleProperties.length,
        hasPreviousPage: page > 1,
      };

      return NextResponse.json(
        {
          value: paginatedProperties,
          pagination: paginationInfo,
        },
        { status: 200 }
      );
    }

    // Construct the base URL with essential fields only
    let url = `https://api.bridgedataoutput.com/api/v2/OData/${DATASET}/Property?$top=${limit}&$skip=${skip}`;

    const filters = [];

    // Add bounds filter if provided
    if (bounds) {
      // Use a more inclusive filter to capture all properties in bounds
      filters.push(`Latitude gt ${bounds.south} and Latitude lt ${bounds.north} and Longitude gt ${bounds.west} and Longitude lt ${bounds.east}`);
    }

    // Add search filter if provided
    if (search) {
        filters.push(`contains(UnparsedAddress, '${search}')`);
    }

    // Add propertyIds filter if provided
    if (propertyIdsParam) {
        const ids = propertyIdsParam.split(',').map(id => `ListingId eq '${id.trim()}'`).join(' or ');
        filters.push(`(${ids})`);
    }

    // Add filter to exclude sold properties and other unavailable statuses
    const excludeStatuses = ["Sold", "Closed", "Withdrawn", "Cancelled", "Expired", "OffMarket"];
    const statusExclusionFilter = excludeStatuses.map(status => `StandardStatus ne '${status}'`).join(' and ');

    const allFilters = [...filters, statusExclusionFilter];
    url += `&$filter=${allFilters.join(' and ')}`;

    // Add select clause to limit the fields we request and improve performance
    url += `&$select=ListingId,ListPrice,UnparsedAddress,StreetNumber,StreetDirPrefix,StreetName,StreetSuffix,City,StateOrProvince,PostalCode,BedroomsTotal,BathroomsTotalInteger,LivingArea,LotSizeAcres,YearBuilt,GarageSpaces,Latitude,Longitude,Media,StandardStatus,PublicRemarks,PropertyType,PropertySubType,AssociationFee,DaysOnMarket,ModificationTimestamp,MIAMIRE_LastStatus`;
    
    // Some OData APIs require $expand for complex properties like Media
    url += `&$expand=Media`;

    let data;
    try {
      data = await makeApiCall(url);
    } catch (error) {
      console.error("Error fetching properties from API, falling back to sample data:", error.message);
      
      // Fallback to sample data if API fails
      console.log("Using sample properties data as fallback");
      
      // Apply bounds filter to sample data if provided
      let filteredSampleProperties = [...sampleProperties];
      
      if (bounds) {
        filteredSampleProperties = filteredSampleProperties.filter(property => 
          property.Latitude > bounds.south && 
          property.Latitude < bounds.north && 
          property.Longitude > bounds.west && 
          property.Longitude < bounds.east
        );
      }
      
      // Apply search filter if provided
      if (search) {
        filteredSampleProperties = filteredSampleProperties.filter(property => 
          property.UnparsedAddress.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply pagination
      const paginatedProperties = filteredSampleProperties.slice(skip, skip + limit);

      // Add pagination metadata
      const paginationInfo = {
        page,
        limit,
        skip,
        hasNextPage: (skip + limit) < filteredSampleProperties.length,
        hasPreviousPage: page > 1,
      };

      return NextResponse.json(
        {
          value: paginatedProperties,
          pagination: paginationInfo,
        },
        { status: 200 }
      );
    }

    // Filter to only include properties that are needed by the app
    const filteredProperties = data.value ? data.value.map(property => ({
      // Essential fields for map display
      id: property.ListingId,
      ListingId: property.ListingId,
      ListPrice: property.ListPrice,
      UnparsedAddress: property.UnparsedAddress,
      StreetNumber: property.StreetNumber,
      StreetDirPrefix: property.StreetDirPrefix,
      StreetName: property.StreetName,
      StreetSuffix: property.StreetSuffix,
      City: property.City,
      StateOrProvince: property.StateOrProvince,
      PostalCode: property.PostalCode,
      
      // Property details
      BedroomsTotal: property.BedroomsTotal,
      BathroomsTotalInteger: property.BathroomsTotalInteger,
      LivingArea: property.LivingArea,
      LotSizeAcres: property.LotSizeAcres,
      YearBuilt: property.YearBuilt,
      GarageSpaces: property.GarageSpaces,
      
      // Location - these are critical for map display
      Latitude: property.Latitude,
      Longitude: property.Longitude,
      
      // Media
      Media: property.Media,
      
      // Status and info
      StandardStatus: property.StandardStatus,
      PublicRemarks: property.PublicRemarks,
      PropertyType: property.PropertyType,
      PropertySubType: property.PropertySubType,
      AssociationFee: property.AssociationFee,
      DaysOnMarket: property.DaysOnMarket,
      ModificationTimestamp: property.ModificationTimestamp,
      
      // Additional fields needed by the UI
      MIAMIRE_LastStatus: property.MIAMIRE_LastStatus,
    })) : [];

    // Add pagination metadata to the response
    const paginationInfo = {
      page,
      limit,
      skip,
      hasNextPage: filteredProperties && filteredProperties.length === limit,
      hasPreviousPage: page > 1,
    };

    return NextResponse.json(
      {
        value: filteredProperties,
        pagination: paginationInfo,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in properties API:", err);
    
    // If there's a complete error, return sample data
    console.log("Using sample properties data due to complete error");
    return NextResponse.json(
      {
        value: sampleProperties,
        pagination: {
          page: 1,
          limit: sampleProperties.length,
          skip: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      },
      { status: 200 }
    );
  }
}