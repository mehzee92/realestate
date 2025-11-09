"use client"
import React, { useEffect, useState, use } from 'react';
import { FiPhone, FiMail, FiGlobe, FiCalendar, FiDollarSign, FiFileText, FiUser, FiBriefcase } from 'react-icons/fi'; // Added FiUser, FiBriefcase
import H2 from '@/components/uis/h2';
import P from '@/components/uis/P';

const PropertyContactDetailsPage = ({ params }) => {
  const { id } = use(params);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch property');
        }

        const data = await response.json();
        console.log(data, "data")
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property contact details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error loading property contact details</p>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className=" flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Property contact details not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" py-5 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto">
        <H2 text="Property Contact Details" className="text-3xl font-extrabold text-gray-900 text-center mb-4" />

        <div className="bg-white shadow-md rounded-lg p-6 mb-4 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Property Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <P text={<><strong>Property ID:</strong> {id}</>} />
            <P text={<><strong>Address:</strong> {property.address || 'N/A'}</>}/>
            {property.ListPrice && <P text={<><strong>List Price:</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(property.ListPrice)}</>}/>}
            {property.ListingAgreement && <P text={<><strong>Listing Agreement:</strong> {property.ListingAgreement}</>}/>}
            {property.ListingContractDate && <P text={<><strong>Listing Contract Date:</strong> {property.ListingContractDate}</>}/>}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-4 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Listing Agent Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <P text={<><FiUser className="inline-block mr-2 text-blue-500" /><strong>Full Name:</strong> {property.ListAgentFullName || 'N/A'}</>}/>
            {property.ListAgentDirectPhone && <P text={<><FiPhone className="inline-block mr-2 text-blue-500" /><strong>Direct Phone:</strong> {property.ListAgentDirectPhone}</>}/>}
            {property.ListAgentEmail && <P text={<><FiMail className="inline-block mr-2 text-blue-500"/> <strong>Email:</strong> {property.ListAgentEmail}</>}/>}
            {property.ListAgentMlsId && <P text={<></>}><strong>MLS ID:</strong> {property.ListAgentMlsId}</P>}
            {property.ListAgentOfficePhone && <P text={<><FiPhone className="inline-block mr-2 text-blue-500" /><strong>Office Phone:</strong> {property.ListAgentOfficePhone}</>}/>}
            {property.ListAgentStateLicense && <P text={<><strong>State License:</strong> {property.ListAgentStateLicense}</>}/>}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Listing Office Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <P text={<><FiBriefcase className="inline-block mr-2 text-blue-500" /><strong>Office Name:</strong> {property.ListOfficeName || 'N/A'}</>}/>
            {property.ListOfficePhone && <P text={<><FiPhone className="inline-block mr-2 text-blue-500" /><strong>Office Phone:</strong> {property.ListOfficePhone}</>}/>}
            {property.ListOfficeFax && <P text={<><strong>Office Fax:</strong> {property.ListOfficeFax}</>}/>}
            {property.ListOfficeURL && <P text={<><FiGlobe className="inline-block mr-2 text-blue-500" /><strong>Office URL:</strong> <a href={property.ListOfficeURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{property.ListOfficeURL}</a></>}/>}
            {property.ListAOR && <P text={<><strong>AOR:</strong> {property.ListAOR}</>}/>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyContactDetailsPage;
