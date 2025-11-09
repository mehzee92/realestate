import React, { useRef, useEffect, useCallback } from 'react';
import Button from '../../uis/Button';
import ListingTypeSwitch from './allFiltersComponents/ListingTypeSwitch';
import PriceRangeSlider from './allFiltersComponents/PriceRangeSlider';
import RoomCountFilter from './allFiltersComponents/RoomCountFilter';
import PropertyTypesFilter from './allFiltersComponents/PropertyTypesFilter';
import ListingStatusFilter from './allFiltersComponents/ListingStatusFilter';
import MoveInDateFilter from './allFiltersComponents/MoveInDateFilter';
import PropertyDetailsFilter from './allFiltersComponents/PropertyDetailsFilter';
import PropertyFeatures from './allFiltersComponents/PropertyFeatures';
import CostsAccordion from './allFiltersComponents/Costs';
import useFilterStore from '../../../store/filters';

const AllFiltersDropdown = ({ open, setOpen, allPropertyTypes }) => {
  const ref = useRef(null);
  const {
    listingType,
    priceRange,
    bedrooms,
    bathrooms,
    propertyTypes,
    listingStatus,
    daysOnMarket,
    moveInDate,
    squareFeet,
    lotSize,
    yearBuilt,
    garageSpaces,
    features,
    keyword,
    associationFee,
    setListingType,
    setPriceRange,
    setBedrooms,
    setBathrooms,
    setPropertyTypes,
    setListingStatus,
    setDaysOnMarket,
    setMoveInDate,
    setSquareFeet,
    setLotSize,
    setYearBuilt,
    setGarageSpaces,
    setFeatures,
    setKeyword,
    setAssociationFee,
    resetFilters,
  } = useFilterStore();

  
  
  useEffect(() => {
    const savedFilters = localStorage.getItem('filters');
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      setListingType(parsedFilters.listingType);
      setPriceRange(parsedFilters.priceRange);
      setBedrooms(parsedFilters.bedrooms);
      setBathrooms(parsedFilters.bathrooms);
      setPropertyTypes(parsedFilters.propertyTypes);
      setListingStatus(parsedFilters.listingStatus);
      setDaysOnMarket(parsedFilters.daysOnMarket);
      setMoveInDate(parsedFilters.moveInDate);
      setSquareFeet(parsedFilters.squareFeet);
      setLotSize(parsedFilters.lotSize);
      setYearBuilt(parsedFilters.yearBuilt);
      setGarageSpaces(parsedFilters.garageSpaces);
      setFeatures(parsedFilters.features);
      setKeyword(parsedFilters.keyword);
      setAssociationFee(parsedFilters.associationFee);
    }
  }, [setListingType, setPriceRange, setBedrooms, setBathrooms, setPropertyTypes, setListingStatus, setDaysOnMarket, setMoveInDate, setSquareFeet, setLotSize, setYearBuilt, setGarageSpaces, setFeatures, setKeyword, setAssociationFee]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open, setOpen]);

  const handlePropertyTypeClick = useCallback((typeValue) => {
    setPropertyTypes(
      propertyTypes.includes(typeValue)
        ? propertyTypes.filter((value) => value !== typeValue)
        : [...propertyTypes, typeValue]
    );
  }, [propertyTypes, setPropertyTypes]);

  const handleSave = () => {
    const filtersToSave = {
      listingType,
      priceRange,
      bedrooms,
      bathrooms,
      propertyTypes,
      listingStatus,
      daysOnMarket,
      moveInDate,
      squareFeet,
      lotSize,
      yearBuilt,
      garageSpaces,
      features,
      keyword,
      associationFee,
    };
    localStorage.setItem('filters', JSON.stringify(filtersToSave));
    setOpen(false);
  };

  const handleClear = () => {
    localStorage.removeItem('filters');
    resetFilters();
  };

  if (!open) return (
    <Button
      
      onClick={() => setOpen(true)}
    >
      All Filters
    </Button>
  );

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50" >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={() => setOpen(false)}
      />
      {/* Modal Panel */}
      <div
        className="relative bg-white border border-gray-200 rounded-xl shadow-2xl w-full max-w-[600px] mx-4 p-6 z-[1002] max-h-[90vh]"
        ref={ref}

      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold">All Filters</h2>
          <button onClick={() => setOpen(false)} className="text-gray-400 cursor-pointer hover:text-black text-3xl">&times;</button>
        </div>
        {/* Accordion Sections */}
        <div className="space-y-6 max-h-[calc(70vh-80px)] overflow-y-auto pr-2">
          <ListingTypeSwitch
            selectedListingType={listingType}
            setSelectedListingType={setListingType}
          />
          <PriceRangeSlider
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
          <RoomCountFilter
            title="Bedrooms"
            labels={['Any', 'Studio', '1', '2', '3', '4', '5+']}
            selectedValue={bedrooms}
            setSelectedValue={setBedrooms}
          />
          <RoomCountFilter
            title="Bathrooms"
            labels={['Any', '1', '2', '3', '4', '5+']}
            selectedValue={bathrooms}
            setSelectedValue={setBathrooms}
          />
          <PropertyTypesFilter
            allPropertyTypes={allPropertyTypes}
            selectedPropertyTypes={propertyTypes}
            handlePropertyTypeClick={handlePropertyTypeClick}
          />
          <ListingStatusFilter
            selectedStatuses={listingStatus}
            setSelectedStatuses={setListingStatus}
            selectedDaysFilter={daysOnMarket}
            setSelectedDaysFilter={setDaysOnMarket}
          />
          {/* Move-in Date Filter */}
          <MoveInDateFilter
            selectedDate={moveInDate}
            setSelectedDate={setMoveInDate}
          />

          <PropertyDetailsFilter
            squareFeetRange={squareFeet}
            setSquareFeetRange={setSquareFeet}
            lotSizeRange={lotSize}
            setLotSizeRange={setLotSize}
            yearBuiltRange={yearBuilt}
            setYearBuiltRange={setYearBuilt}
            garageSpaces={garageSpaces}
            setGarageSpaces={setGarageSpaces}
          />

          <PropertyFeatures
            selectedFeatures={features}
            setSelectedFeatures={setFeatures}
            keyword={keyword}
            setKeyword={setKeyword}
          />
          <CostsAccordion
            selected={associationFee}
            setSelected={setAssociationFee}
          />


        </div>
        {/* Save Button */}
        <div className="flex justify-end gap-2 mt-8">
          <Button onClick={handleClear} className="text-gray-500 hover:text-black px-6 py-2 rounded-md">Clear</Button>
          <button onClick={handleSave} className="bg-black cursor-pointer text-white px-6  rounded-md hover:text-white hover:bg-gray-900">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AllFiltersDropdown;
