import React, { useState } from 'react';
import Button from '../../../uis/Button';
import H2 from '@/components/uis/h2';

const ListingStatusFilter = ({
    selectedStatuses = [],
    setSelectedStatuses,
    selectedDaysFilter = 'Any',
    setSelectedDaysFilter
}) => {
    const [isListingStatusOpen, setIsListingStatusOpen] = useState(false);

    const listingStatuses = [
        'Active',
        'Coming soon',
        'Pending',
        'Under contract',
        'Sold'
    ];

    const daysOnMarketFilters = [
        'Any',
        '1 day',
        '7 days',
        '14 days',
        '1 month',
        '3 months',
        '6 months',
        '12 months'
    ];

    const handleStatusChange = (status) => {
        const updatedStatuses = selectedStatuses.includes(status)
            ? selectedStatuses.filter(s => s !== status)
            : [...selectedStatuses, status];
        setSelectedStatuses(updatedStatuses);
    };

    const handleDaysFilterChange = (filter) => {
        setSelectedDaysFilter(filter);
    };

    return (
        <div className="w-full">
            {/* Listing Status Accordion */}
            <div className="border-b border-gray-200">
                <button
                    onClick={() => setIsListingStatusOpen(!isListingStatusOpen)}
                    className="w-full py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                    <H2 text="Listing status" />
                    
                    <svg
                        className={`h-5 w-5 text-gray-500 transition-transform ${isListingStatusOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isListingStatusOpen && (
                    <div className="pb-4 relative z-[9998]">
                        {listingStatuses.map((status) => (
                            <label
                                key={status}
                                className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded"
                            >
                                <span className="text-gray-700 text-sm">{status}</span>
                                <input
                                    type="checkbox"
                                    checked={selectedStatuses.includes(status)}
                                    onChange={() => handleStatusChange(status)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                            </label>
                        ))}
                        {/* Days on Market Section */}
                        <div className="py-4">
                            <h3 className="font-medium mb-2">Days on market</h3>

                            <div className="flex flex-wrap gap-2">
                                {daysOnMarketFilters.map((filter) => (
                                    <Button
                                        key={filter}
                                        onClick={() => handleDaysFilterChange(filter)}
                                        className={`px-4 py-2 rounded-md font-medium ${
                                            selectedDaysFilter === filter
                                                ? 'bg-[#e5e5e5] text-blue-600 hover:bg-[#d5d5d5]'
                                                : 'bg-[#f5f5f5] text-black hover:bg-[#e5e5e5]'
                                        }`}
                                    >
                                        {filter}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                )}

            </div>


        </div>
    );
};

export default ListingStatusFilter;