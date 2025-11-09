// src/utils/api-utils.js

export const makeApiCall = async (url) => {
  const DATASET = process.env.MLS_DATASET || "miamire";
  const TOKEN = process.env.MLS_API_TOKEN || "088f263ee8c491d93e778f1f48283f4a";
  
  try {
    // Verify that we have required environment variables
    if (!TOKEN || TOKEN === "088f263ee8c491d93e778f1f48283f4a") {
      console.warn("Warning: Using default API token. Please set MLS_API_TOKEN environment variable.");
      // Don't make API call with default token, throw an error to trigger fallback
      throw new Error(JSON.stringify({ code: 401, message: "API token not configured" }));
    }
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", response.status, errorText);
      console.error("Request URL:", url);
      console.error("Dataset:", DATASET);
      console.error("Token exists:", !!TOKEN);
      const errorObj = { code: response.status, message: errorText };
      throw new Error(JSON.stringify(errorObj));
    }

    return await response.json();
  } catch (error) {
    console.error("API call error:", error.message);
    throw error;
  }
};