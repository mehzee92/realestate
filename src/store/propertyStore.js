import { create } from 'zustand';

const usePropertyStore = create((set) => ({
  allProperties: [],
  isLoading: false,
  fetchError: null,
  setAllProperties: (properties) => set({ allProperties: properties }),
  addProperties: (newProperties) =>
    set((state) => {
      const existingIds = new Set(state.allProperties.map((p) => p.id));
      const uniqueNewProperties = newProperties.filter(
        (p) => !existingIds.has(p.id)
      );
      return {
        allProperties: [...state.allProperties, ...uniqueNewProperties],
      };
    }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setFetchError: (error) => set({ fetchError: error }),
  clearProperties: () =>
    set({ allProperties: [], isLoading: false, fetchError: null }),
}));

export default usePropertyStore;