'use client'
import React, { useState, useRef, useEffect } from 'react';
import { FiHome } from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { BiBuilding } from "react-icons/bi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { PiBuildingApartmentLight } from "react-icons/pi";
import { MdOutlineStorefront } from "react-icons/md";
import { RiHome6Line } from "react-icons/ri";
import { TbPhotoSquareRounded } from "react-icons/tb";
import { BsThreeDots } from "react-icons/bs";
import SearchInput from '../uis/SearchInput';
import Input from '../uis/Input';
import PriceRangeFilter from '../uis/PriceRangeFilter';
import DropdownButton from './filterComponents/DropdownButton';
import PropertyTypeGrid from './filterComponents/PropertyTypeGrid';
import TypeSelectorDropdown from './filterComponents/TypeSelectorDropdown';
import BedsDropdown from './filterComponents/BedsDropdown';
import BathsDropdown from './filterComponents/BathsDropdown';
import AllFiltersDropdown from './filterComponents/AllFiltersDropdown';
import useFilterStore from '../../store/filters';
import useViewStore from '../../store/viewStore';
import Button from '../uis/Button';

function SearchAndFilters() {
    const [priceFilterOpen, setPriceFilterOpen] = useState(false);
    const [typeFilterOpen, setTypeFilterOpen] = useState(false);
    const [propertyTypeFilterOpen, setPropertyTypeFilterOpen] = useState(false);
    const [bedsDropdownOpen, setBedsDropdownOpen] = useState(false);
    const [bathsDropdownOpen, setBathsDropdownOpen] = useState(false);
    const [allFiltersOpen, setAllFiltersOpen] = useState(false);

    const priceFilterRef = useRef(null);
    const typeFilterRef = useRef(null);
    const propertyTypeFilterRef = useRef(null);
    const bedsDropdownRef = useRef(null);
    const bathsDropdownRef = useRef(null);

    // Get filter state from global store
    const {
        listingType,
        priceRange,
        bedrooms,
        bathrooms,
        type,
        keyword,
        setListingType,
        setPriceRange,
        setBedrooms,
        setBathrooms,
        setPropertyTypes,
        setKeyword
    } = useFilterStore();
    const { viewMode, setViewMode } = useViewStore();
    
    // Format price with currency formatting
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Define all property types for property type filter
    const allPropertyTypes = [
        {
            name: 'Residential',
            value: 'residential',
            icon: <FiHome size={25} />
        },
        {
            name: 'Residential Income',
            value: 'residentialincome',
            icon: <FiHome size={25} />
        },
        {
            name: 'Commercial Land',
            value: 'commercialland',
            icon: <TbPhotoSquareRounded size={25} />
        },
        {
            name: 'Commercial Sale',
            value: 'commercialsale',
            icon: <MdOutlineStorefront size={25} />
        },
        {
            name: 'Land/Boat Docks',
            value: 'landboatdocks',
            icon: <TbPhotoSquareRounded size={25} />
        },
        {
            name: 'Other Types',
            value: '',
            icon: <BsThreeDots size={25} />
        }
    ];

    // Handle price range change
    const handlePriceChange = (newRange) => {
        setPriceRange(newRange);
    };

    // Handle min price input
    const handleMinPriceInput = (e) => {
        const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
        const clamped = Math.min(value, priceRange[1] - 10000);
        setPriceRange([clamped, priceRange[1]]);
    };

    // Handle max price input
    const handleMaxPriceInput = (e) => {
        const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
        const clamped = Math.max(value, priceRange[0] + 10000);
        setPriceRange([priceRange[0], clamped]);
    };

    // Get price range text for display
    const getPriceRangeText = () => {
        const [minPrice, maxPrice] = priceRange;
        if (minPrice === 0 && maxPrice >= 1000000) {
            return `${(maxPrice / 1000000).toFixed(0)}M+`;
        } else if (minPrice >= 1000000 && maxPrice >= 1000000) {
            return `${(minPrice / 1000000).toFixed(0)}M - ${(maxPrice / 1000000).toFixed(0)}M`;
        } else {
            return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
        }
    };

    // Handle property type selection
    const handlePropertyTypeSelect = (propertyType) => {
        if (propertyType === '') { // 'Other Types' has an empty string value
            const { resetFilters } = useFilterStore.getState();
            resetFilters();
        } else {
            setPropertyTypes([propertyType]);
        }
        setPropertyTypeFilterOpen(false);
    };

    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (priceFilterRef.current && !priceFilterRef.current.contains(event.target)) {
                setPriceFilterOpen(false);
            }
            if (typeFilterRef.current && !typeFilterRef.current.contains(event.target)) {
                setTypeFilterOpen(false);
            }
            if (propertyTypeFilterRef.current && !propertyTypeFilterRef.current.contains(event.target)) {
                setPropertyTypeFilterOpen(false);
            }
            if (bedsDropdownRef.current && !bedsDropdownRef.current.contains(event.target)) {
                setBedsDropdownOpen(false);
            }
            if (bathsDropdownRef.current && !bathsDropdownRef.current.contains(event.target)) {
                setBathsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <div className={`py-5 px-5 flex flex-wrap ${priceFilterOpen || typeFilterOpen || propertyTypeFilterOpen || bedsDropdownOpen || bathsDropdownOpen || allFiltersOpen ? 'z-[90]' : 'z-10 md:z-20'} fixed top-[80px] w-screen bg-[#f7f7f7] flex-col md:flex-row justify-between items-center gap-2 overflow-visible`}>
                <div className='flex flex-wrap gap-2 w-full md:w-auto'>
                    {/* Search Input Field */}
                    <SearchInput
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder='Search...'
                        className='w-full md:w-[300px] px-4 py-[5px] border border-gray-300 rounded-md focus:outline-none '
                    />
                    <div className='md:flex hidden items-center gap-2 md:w-auto'>
                        {/* Listing Type Filter (For Sale / For Rent) */}
                        <div className='md:relative' ref={typeFilterRef}>
                            <TypeSelectorDropdown
                                forwardedRef={typeFilterRef}
                                selectedType={listingType}
                                setSelectedType={(type) => setListingType(type)}
                                isOpen={typeFilterOpen}
                                setIsOpen={setTypeFilterOpen}
                            />
                        </div>

                        {/* Price Range Filter */}
                        <PriceRangeFilter
                            priceRange={priceRange}
                            isOpen={priceFilterOpen}
                            onToggle={() => setPriceFilterOpen(!priceFilterOpen)}
                            onPriceChange={handlePriceChange}
                            onMinPriceInput={handleMinPriceInput}
                            onMaxPriceInput={handleMaxPriceInput}
                            formatPrice={formatPrice}
                            getPriceRangeText={getPriceRangeText}
                        />

                        {/* Property Type Filter */}
                        <div className='md:relative' ref={propertyTypeFilterRef}>
                            <DropdownButton
                                isOpen={propertyTypeFilterOpen}
                                onClick={() => setPropertyTypeFilterOpen(!propertyTypeFilterOpen)}
                            >
                                All property types
                            </DropdownButton>
                            {propertyTypeFilterOpen && (
                                <PropertyTypeGrid
                                    allPropertyTypes={allPropertyTypes}
                                    onTypeClick={handlePropertyTypeSelect}
                                    selectedType={type}
                                    className="absolute top-[110%] left-0 border border-gray-200 shadow-lg rounded-xl bg-white z-[100] p-2 w-[450px]"
                                />
                            )}
                        </div>

                        {/* Bedrooms Filter */}
                        <div className='relative' ref={bedsDropdownRef}>
                            <BedsDropdown
                                value={bedrooms}
                                onChange={setBedrooms}
                                open={bedsDropdownOpen}
                                setOpen={(open) => {
                                    setBedsDropdownOpen(open);
                                    if (open) {
                                        setBathsDropdownOpen(false);
                                        setPriceFilterOpen(false);
                                        setTypeFilterOpen(false);
                                        setPropertyTypeFilterOpen(false);
                                    }
                                }}
                                className="absolute top-[110%] left-0 border border-gray-200 shadow-lg rounded-xl bg-white z-[100] p-2 w-fit"
                            />
                        </div>
                        
                        {/* Bathrooms Filter */}
                        <div className='relative' ref={bathsDropdownRef}>
                            <BathsDropdown
                                value={bathrooms}
                                onChange={setBathrooms}
                                open={bathsDropdownOpen}
                                setOpen={(open) => {
                                    setBathsDropdownOpen(open);
                                    if (open) {
                                        setBedsDropdownOpen(false);
                                        setPriceFilterOpen(false);
                                        setTypeFilterOpen(false);
                                        setPropertyTypeFilterOpen(false);
                                    }
                                }}
                                className="absolute top-[110%] left-0 border border-gray-200 shadow-lg rounded-xl bg-white z-[100] p-2 w-fit"
                            />
                        </div>
                    </div>
                </div>

                <div className='w-full md:w-fit pr-4 flex items-center gap-2 relative'>
                    {/* View Mode Toggle */}
                    <div className="items-center hidden md:flex bg-gray-200 rounded-full p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-1 text-xs rounded-full transition-colors duration-200 ${viewMode === 'list' ? 'bg-white text-gray-900 shadow' : 'bg-transparent text-gray-700 hover:bg-gray-300'}`}
                        >
                            List
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`px-4 py-1 text-xs  rounded-full transition-colors duration-200 ${viewMode === 'map' ? 'bg-white text-gray-900 shadow' : 'bg-transparent text-gray-700 hover:bg-gray-300'}`}
                        >
                            Map
                        </button>
                    </div>
                    
                    {/* Clear Filters Button */}
                    <Button
                        onClick={() => {
                            const { resetFilters } = useFilterStore.getState();
                            resetFilters();
                        }}
                    >
                        Clear Filters
                    </Button>

                    {/* All Filters Dropdown */}
                    {/* Advanced Filters Dropdown */}
                    <AllFiltersDropdown
                        open={allFiltersOpen}
                        setOpen={(open) => {
                            setAllFiltersOpen(open);
                            if (open) {
                                setBedsDropdownOpen(false);
                                setBathsDropdownOpen(false);
                                setPriceFilterOpen(false);
                                setTypeFilterOpen(false);
                                setPropertyTypeFilterOpen(false);
                            }
                        }}
                        allPropertyTypes={allPropertyTypes}
                        className="absolute md:top-[110%] left-[50%] translate-x-[-50%] md:translate-x-0 md:left-0 border border-gray-200 shadow-lg rounded-xl bg-white p-2 w-fit"
                    />

                    {/* Save Search Button */}
                    <button className='bg-black text-xs h-9 hover:bg-gray-800 px-2 py-[5px] rounded-md cursor-pointer text-white'>Save Search</button>
                </div>
            </div>
        </>
    );
}

export default SearchAndFilters;
