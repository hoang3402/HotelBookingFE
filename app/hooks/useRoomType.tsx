import {domain} from "@/app/actions/getRoomById";
import {RoomType} from "@/app/type";

import {create} from 'zustand';

interface RoomTypeStore {
  roomTypes: RoomType[]
  fetchRoomTypes: () => void
}

export const useRoomType = create<RoomTypeStore>((set) => ({
  roomTypes: [],
  fetchRoomTypes: async () => {
    const res = await fetch(`${domain}api/room-type/`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    set({roomTypes: data});
  },
}))