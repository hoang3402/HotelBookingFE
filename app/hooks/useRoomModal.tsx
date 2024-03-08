import {create} from 'zustand';

interface RoomModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  roomId: string | null;
  setRoomId: (id: string) => void;
}

const useRoomModal = create<RoomModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({isOpen: true}),
  onClose: () => set({isOpen: false}),
  roomId: null,
  setRoomId: (id: string) => set({roomId: id}),
}));


export default useRoomModal;
