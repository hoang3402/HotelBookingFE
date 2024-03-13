import {create} from 'zustand';

interface SideBarStore {
  isOpen: boolean;
  toggle: () => void;
}

export const useSideBar = create<SideBarStore>((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({isOpen: !state.isOpen})),
}));