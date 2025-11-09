import { create } from 'zustand';

const useMapStore = create((set) => ({
  mapBounds: null,
  setMapBounds: (bounds) => set({ mapBounds: bounds }),
}));

export default useMapStore;
