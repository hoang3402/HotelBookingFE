"use client";

import useRoomModal from "@/app/hooks/useRoomModal";
import Image from "next/image"
import React from "react"
import {FormattedPrice} from "@/app/components/Ultility";

interface listingCardRoomProps {
  room: any,
  currency: any
}

const ListingCardRoom: React.FC<listingCardRoomProps> = ({room, currency}) => {
  const formattedPrice = FormattedPrice(room.price, currency)
  return (
    <div className="w-full rounded-2xl cursor-pointer border-[1px] p-3">
      <h2 className="text-2xl font-bold">{room?.name}</h2>
      <div className="flex">
        <div className="h-[126px] w-[208px]">
          <Image
            src={room?.image}
            alt={room?.name}
            className="w-full h-auto object-cover rounded-2xl"
            width={208}
            height={126}
          />
        </div>
        <div className="flex flex-col ml-4">
          <span className="text-gray-500">Price per night</span>
          <span className="text-xl font-bold">{formattedPrice}</span>
        </div>
      </div>
    </div>
  )
}

interface ListingRoomProps {
  rooms: any,
  currency: any
}

export const ListingRoom: React.FC<ListingRoomProps> = ({rooms, currency}) => {
  const roomModal = useRoomModal()

  function handleClick(roomId: any) {
    roomModal.setRoomId(roomId)
    roomModal.onOpen()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Rooms</h2>
      <div className={'flex flex-col gap-3'}>
        {rooms && (
          rooms.map((room: any) => (
            <div
              key={room.id}
              onClick={() => handleClick(room.id)}
            >
              <ListingCardRoom room={room} currency={currency}/>
            </div>
          ))
        )}
      </div>
    </div>
  )
}