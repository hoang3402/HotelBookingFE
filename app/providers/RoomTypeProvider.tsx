"use client";

import {useRoomType} from "@/app/hooks/useRoomType";
import {useEffect} from "react";

const RoomTypeProvider = () => {
  const {roomTypes, fetchRoomTypes} = useRoomType()

  useEffect(() => {
    if (!roomTypes.length) {
      fetchRoomTypes()
    }
  })

  return <></>
}

export default RoomTypeProvider