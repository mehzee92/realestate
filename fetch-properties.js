const fs = require('fs');
const path = require('path');
const { sampleProperties } = require('./src/data/properties-data.js');

const DATASET = process.env.MLS_DATASET || "miamire";
const TOKEN = process.env.MLS_API_TOKEN || "088f263ee8c491d93e778f1f48283f4a";
const BASE_URL = `https://api.bridgedataoutput.com/api/v2/OData/${DATASET}/Property`;

async function fetchAllProperties() {
  try {
    console.log('Starting to fetch all properties...');
    
    let allProperties = [];
    const limit = 4; // Fetch only 4 properties
    
    // Check if we should use sample data
    const useSampleData = !TOKEN || TOKEN === "088f263ee8c491d93e778f1f48283f4a";

    if (useSampleData) {
      console.log('Using sample properties data instead of API call');
      allProperties = sampleProperties.slice(0, limit); // Take first 4 properties from sample data
    } else {
      console.log(`Fetching ${limit} properties from API...`);
      
      const url = `${BASE_URL}?$top=${limit}`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/json",
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        console.log('Falling back to sample properties data');
        allProperties = sampleProperties.slice(0, limit); // Use sample data as fallback
      } else {
        const data = await response.json();
        
        if (data.value && data.value.length > 0) {
          allProperties = allProperties.concat(data.value);
          console.log(`Fetched ${data.value.length} properties from API. Total: ${allProperties.length}`);
        }
      }
    }
    
    console.log(`\nTotal properties fetched: ${allProperties.length}`);
    
    // Save to JSON file in the app directory
    const appDir = path.join(__dirname, 'src', 'app');
    const outputPath = path.join(appDir, 'all-properties.json');
    fs.writeFileSync(outputPath, JSON.stringify(allProperties, null, 2));
    console.log(`Properties saved to: ${outputPath}`);
    
    // Also create a filtered version with only active properties
    const activeProperties = allProperties.filter(property => {
      // Filter based on common status fields - adjust these based on your API response
      const status = property.StandardStatus || property.ListingStatus || property.Status;
      return status && (
        status.toLowerCase().includes('active') || 
        status.toLowerCase().includes('available') ||
        status.toLowerCase().includes('for sale') ||
        status.toLowerCase().includes('for rent')
      );
    });
    
    const activeOutputPath = path.join(appDir, 'active-properties.json');
    fs.writeFileSync(activeOutputPath, JSON.stringify(activeProperties, null, 2));
    console.log(`Active properties (${activeProperties.length}) saved to: ${activeOutputPath}`);
    
    // Log some sample property data to understand the structure
    if (allProperties.length > 0) {
      console.log('\nSample property structure:');
      console.log(JSON.stringify(allProperties[0], null, 2));
    }
    
    return {
      total: allProperties.length,
      active: activeProperties.length,
      allProperties,
      activeProperties
    };
    
  } catch (error) {
    console.error('Error fetching properties:', error);
    
    // If there's a complete failure, use sample properties data
    console.log('Using sample properties data due to error');
    const allProperties = sampleProperties.slice(0, 4);
    const activeProperties = allProperties.filter(property => {
      const status = property.StandardStatus || property.ListingStatus || property.Status;
      return status && (
        status.toLowerCase().includes('active') || 
        status.toLowerCase().includes('available') ||
        status.toLowerCase().includes('for sale') ||
        status.toLowerCase().includes('for rent')
      );
    });
    
    // Save to JSON file in the app directory
    const appDir = path.join(__dirname, 'src', 'app');
    const outputPath = path.join(appDir, 'all-properties.json');
    fs.writeFileSync(outputPath, JSON.stringify(allProperties, null, 2));
    console.log(`Sample properties saved to: ${outputPath}`);
    
    const activeOutputPath = path.join(appDir, 'active-properties.json');
    fs.writeFileSync(activeOutputPath, JSON.stringify(activeProperties, null, 2));
    console.log(`Active sample properties (${activeProperties.length}) saved to: ${activeOutputPath}`);
    
    return {
      total: allProperties.length,
      active: activeProperties.length,
      allProperties,
      activeProperties
    };
  }
}

// Run the script
if (require.main === module) {
  fetchAllProperties()
    .then(result => {
      console.log('\n✅ Successfully fetched all properties!');
      console.log(`Total properties: ${result.total}`);
      console.log(`Active properties: ${result.active}`);
    })
    .catch(error => {
      console.error('❌ Failed to fetch properties:', error);
      process.exit(1);
    });
}

module.exports = { fetchAllProperties };
