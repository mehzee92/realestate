'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import PropertyDetail from '@/components/property-detail/PropertyDetail';
import LoadingSpinner from '@/components/uis/LoadingSpinner';
import ErrorDisplay from '@/components/uis/ErrorDisplay';
import NotFoundDisplay from '@/components/uis/NotFoundDisplay';

const PropertyDetailPage = ({ params }) => {
  const { id } = use(params);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) {
          // Try to parse error details from the response
          let errorMessage = 'Failed to fetch property';
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.details || errorMessage;
          } catch (e) {}
          throw new Error(errorMessage);
        }

        const data = await response.json();

        
        // API response is now the raw property object directly
        if (!data || data.error) {
          throw new Error(data?.error || 'Property not found');
        }

        // Use the raw property data directly - no transformation needed
        // This gives us access to all available fields from the API
        setProperty(data);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading property details..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!property) {
    return <NotFoundDisplay />;
  }

  return (
    <>
      <PropertyDetail property={property} />
    </>
  );
};

export default PropertyDetailPage;