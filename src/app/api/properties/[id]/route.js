import { NextResponse } from "next/server";
import { makeApiCall } from "../../../../utils/api-utils";
import { sampleProperties } from "../../../../data/properties-data";

const SERVER_TOKEN = process.env.MLS_API_TOKEN || "088f263ee8c491d93e778f1f48283f4a";
const DATASET = process.env.MLS_DATASET || "miamire";
const BASE_URL = `https://api.bridgedataoutput.com/api/v2/OData/${DATASET}/Property`;

export async function GET(request, { params }) {
  const { id } = await params; // dynamic route param

  try {
    // Escape single quotes per OData rules by doubling them
    const safeId = String(id).replace(/'/g, "''");
    const filter = encodeURIComponent(`ListingId eq '${safeId}'`);

    // Check if we should use sample data
    const useSampleData = !process.env.MLS_API_TOKEN || process.env.MLS_API_TOKEN === "088f263ee8c491d93e778f1f48283f4a";

    if (useSampleData) {
      // Return sample data if no token is configured
      console.log("Using sample property data for property ID route");
      
      // Find property in sample data
      const property = sampleProperties.find(p => p.id === id || p.ListingId === id);
      
      if (property) {
        return NextResponse.json(property, { status: 200 });
      } else {
        return NextResponse.json({ error: "Property not found in sample data" }, { status: 404 });
      }
    }

    let data;
    try {
      data = await makeApiCall(`${BASE_URL}?$top=1&$filter=${filter}`);
    } catch (error) {
      console.error("Error fetching property by ID from API, falling back to sample data:", error.message);
      
      // Fallback to sample data if API fails
      console.log("Using sample property data as fallback for property ID route");
      
      // Find property in sample data
      const property = sampleProperties.find(p => p.id === id || p.ListingId === id);
      
      if (property) {
        return NextResponse.json(property, { status: 200 });
      } else {
        return NextResponse.json({ error: "Property not found in sample data" }, { status: 404 });
      }
    }

    // The API returns an object with a 'value' array for filtered results
    // We expect only one property for a specific ListingId
    if (data.value && data.value.length > 0) {
      const property = data.value[0];
      
      // Return all available data from the API without transformation
      // This ensures we have access to all fields for the property details page
      return NextResponse.json(property, { status: 200 });
    } else {
      return NextResponse.json({ error: "Property not found in API" }, { status: 404 });
    }
  } catch (err) {
    console.error("Error in property by ID API:", err);
    
    // If there's a complete error, return sample data
    console.log("Using sample property data due to complete error in property ID route");
    
    // Find property in sample data
    const property = sampleProperties.find(p => p.id === id || p.ListingId === id);
    
    if (property) {
      return NextResponse.json(property, { status: 200 });
    } else {
      return NextResponse.json({ error: "Property not found in sample data" }, { status: 404 });
    }
  }
}

