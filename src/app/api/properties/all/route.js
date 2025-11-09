import { NextResponse } from "next/server";
import { makeApiCall } from "../../../../utils/api-utils";
import { sampleProperties } from "../../../../data/properties-data";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    // For fetching all properties, we'll use a paginated approach on the backend
    // to avoid timeouts and handle large datasets properly
    const maxLimit = 1000;
    const limit = Math.min(parseInt(searchParams.get("limit")) || 1000, maxLimit); // Maximum 1000 per request
    const skip = parseInt(searchParams.get("skip")) || 0;
    const maxSkip = 50000; // Increase limit to fetch more properties (up to 50k)
    
    if (skip > maxSkip) {
      return NextResponse.json(
        { error: "Skip value too large", details: `Maximum skip is ${maxSkip}` },
        { status: 400 }
      );
    }

    // Check if we should use sample data
    const useSampleData = !process.env.MLS_API_TOKEN || process.env.MLS_API_TOKEN === "088f263ee8c491d93e778f1f48283f4a";

    if (useSampleData) {
      // Return sample data if no token is configured
      console.log("Using sample properties data for all properties route");
      
      // Apply pagination to sample data
      const paginatedProperties = sampleProperties.slice(skip, skip + limit);

      return NextResponse.json(
        {
          value: paginatedProperties,
          count: paginatedProperties.length,
          pagination: {
            skip,
            limit,
            hasNextPage: (skip + limit) < sampleProperties.length,
            hasPreviousPage: skip > 0,
          }
        },
        { status: 200 }
      );
    }

    // Construct the URL for properties with essential fields only
    const DATASET = process.env.MLS_DATASET || "miamire";
    let url = `https://api.bridgedataoutput.com/api/v2/OData/${DATASET}/Property?$top=${limit}&$skip=${skip}`;

    const filters = [];
    const status = searchParams.get("status");
    if (status) {
      filters.push(`StandardStatus eq '${status}'`);
    }

    // Add filter to exclude sold properties and other unavailable statuses
    const excludeStatuses = ["Sold", "Closed", "Withdrawn", "Cancelled", "Expired", "OffMarket"];
    filters.push(excludeStatuses.map(s => `StandardStatus ne '${s}'`).join(' and '));

    if (filters.length > 0) {
      url += `&$filter=${filters.join(' and ')}`;
    }

    // Limit the fields we request to essential ones for better performance
    url += `&$select=ListingId,ListPrice,UnparsedAddress,StreetNumber,StreetDirPrefix,StreetName,StreetSuffix,City,StateOrProvince,PostalCode,BedroomsTotal,BathroomsTotalInteger,LivingArea,LotSizeAcres,YearBuilt,GarageSpaces,Latitude,Longitude,StandardStatus,PublicRemarks,PropertyType,PropertySubType,AssociationFee,DaysOnMarket,ModificationTimestamp,MIAMIRE_LastStatus`;

    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100)); // Increased delay to be more respectful to API
    
    let data;
    try {
      data = await makeApiCall(url);
    } catch (error) {
      console.error("Error fetching all properties from API, falling back to sample data:", error.message);
      
      // Fallback to sample data if API fails
      console.log("Using sample properties data as fallback for all properties route");
      
      // Apply pagination to sample data
      const paginatedProperties = sampleProperties.slice(skip, skip + limit);

      return NextResponse.json(
        {
          value: paginatedProperties,
          count: paginatedProperties.length,
          pagination: {
            skip,
            limit,
            hasNextPage: (skip + limit) < sampleProperties.length,
            hasPreviousPage: skip > 0,
          }
        },
        { status: 200 }
      );
    }

    // Return only essential fields for better performance
    const essentialProperties = data.value ? data.value.map(property => ({
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
      BedroomsTotal: property.BedroomsTotal,
      BathroomsTotalInteger: property.BathroomsTotalInteger,
      LivingArea: property.LivingArea,
      LotSizeAcres: property.LotSizeAcres,
      YearBuilt: property.YearBuilt,
      GarageSpaces: property.GarageSpaces,
      Latitude: property.Latitude,
      Longitude: property.Longitude,
      StandardStatus: property.StandardStatus,
      PublicRemarks: property.PublicRemarks,
      PropertyType: property.PropertyType,
      PropertySubType: property.PropertySubType,
      AssociationFee: property.AssociationFee,
      DaysOnMarket: property.DaysOnMarket,
      ModificationTimestamp: property.ModificationTimestamp,
      MIAMIRE_LastStatus: property.MIAMIRE_LastStatus,
    })) : [];

    return NextResponse.json(
      {
        value: essentialProperties,
        count: essentialProperties.length,
        pagination: {
          skip,
          limit,
          hasNextPage: essentialProperties.length === limit,
          hasPreviousPage: skip > 0,
        }
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching all properties:", err);
    return NextResponse.json(
      { error: "Error fetching all properties", details: err.message },
      { status: 500 }
    );
  }
}