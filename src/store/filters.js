import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFilterStore = create(
  persist(
    (set) => ({
      // Initial state
      listingType: 'For Sale',
      priceRange: [0, 20000000],
      bedrooms: 'Any',
      bathrooms: 'Any',
      propertyTypes: [],
      listingStatus: [],
      daysOnMarket: 'Any',
      moveInDate: null,
      squareFeet: [0, 10000],
      lotSize: [0, 50],
      yearBuilt: [1900, 2024],
      garageSpaces: 0,
      features: [],
      keyword: '',
      associationFee: 'All',

      // Actions
      setListingType: (listingType) => set({ listingType }),
      setPriceRange: (priceRange) => set({ priceRange }),
      setBedrooms: (bedrooms) => set({ bedrooms }),
      setBathrooms: (bathrooms) => set({ bathrooms }),
      setPropertyTypes: (propertyTypes) => set({ propertyTypes }),
      setListingStatus: (listingStatus) => set({ listingStatus }),
      setDaysOnMarket: (daysOnMarket) => set({ daysOnMarket }),
      setMoveInDate: (moveInDate) => set({ moveInDate }),
      setSquareFeet: (squareFeet) => set({ squareFeet }),
      setLotSize: (lotSize) => set({ lotSize }),
      setYearBuilt: (yearBuilt) => set({ yearBuilt }),
      setGarageSpaces: (garageSpaces) => set({ garageSpaces }),
      setFeatures: (features) => set({ features }),
      setKeyword: (keyword) => set({ keyword }),
      setAssociationFee: (associationFee) => set({ associationFee }),

      // Reset all filters to their initial state
      resetFilters: () =>
        set({
          listingType: 'For Sale',
          priceRange: [0, 20000000],
          bedrooms: 'Any',
          bathrooms: 'Any',
          propertyTypes: [],
          listingStatus: [],
          daysOnMarket: 'Any',
          moveInDate: null,
          squareFeet: [0, 10000],
          lotSize: [0, 50],
          yearBuilt: [1900, 2024],
          garageSpaces: 0,
          features: [],
          keyword: '',
          associationFee: 'All',
        }),
    }),
    {
      name: 'filter-store', // name of the item in the storage (must be unique)
    }
  )
);

export default useFilterStore;