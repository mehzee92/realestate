# Fixing the 401 Unauthorized Error

## Changes Made

The 401 Unauthorized error was occurring because:

1. The API token was hardcoded in the server-side API routes
2. The agent configuration was causing issues in the Next.js environment
3. Environment variables were not properly configured for the deployment environment

## Solutions Applied

### 1. Updated API Routes to Use Environment Variables

All API routes now use environment variables for:
- `MLS_API_TOKEN`: The API token for the MLS service
- `MLS_DATASET`: The dataset name (defaults to "miamire")

### 2. Fixed Environment Configuration

Created `.env.local` file with proper environment variables:
```
# API Configuration
MLS_API_TOKEN=088f263ee8c491d93e778f1f48283f4a
MLS_DATASET=miamire

# JWT Secret for authentication
JWT_SECRET=your-secret-key-here

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyCOikS9vy1EMNjx04ysU9MhNaQW_7nHu28
```

### 3. Improved Error Handling

Added better error handling and debugging information to help diagnose future issues.

### 4. Cleaned Up API Calls

Removed problematic agent configuration that was causing issues in Next.js environment.

## How to Test the Fix

### For Local Development

1. Update your `.env.local` file with your actual API token:
```
MLS_API_TOKEN=your_actual_token_here
MLS_DATASET=miamire
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

2. Run the application:
```bash
npm run dev
```

3. Navigate to the home page and check if properties are loading on the map.

### For Vercel Deployment

1. Set the environment variables in your Vercel dashboard:
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables"
   - Add the following variables:
     - `MLS_API_TOKEN`: Your actual MLS API token
     - `MLS_DATASET`: Your dataset (default is "miamire")
     - `JWT_SECRET`: Your JWT secret
     - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Your Google Maps API key

2. Redeploy your application.

## Troubleshooting

If you still encounter the 401 error:

1. Verify that your `MLS_API_TOKEN` is valid and has not expired
2. Check that the token has the correct permissions for your dataset
3. Confirm that the dataset name matches your MLS provider's requirements
4. Review the browser console for any additional error messages

## API Endpoints Updated

- `/api/properties` (with bounds, pagination, etc.)
- `/api/properties/all`
- `/api/properties/[id]`

All of these endpoints now use environment variables and improved error handling.