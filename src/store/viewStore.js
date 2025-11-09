import { create } from 'zustand';

const useViewStore = create((set) => ({
  viewMode: 'map', // 'map' or 'list'
  setViewMode: (viewMode) => set({ viewMode }),
}));

export default useViewStore;
