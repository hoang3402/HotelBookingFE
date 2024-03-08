import {create} from 'zustand';

interface RoomModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useRoomModal = create<RoomModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({isOpen: true}),
  onClose: () => set({isOpen: false})
}));


export default useRoomModal;
