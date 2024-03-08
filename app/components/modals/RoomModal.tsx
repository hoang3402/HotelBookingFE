"use client";

import Modal from "@/app/components/modals/Modal";
import useRoomModal from "@/app/hooks/useRoomModal";
import React, {useEffect, useState} from "react";
import Calendar from "@/app/components/inputs/Calendar";
import {DateRange} from "react-date-range";

const RoomModal = () => {
  let roomModal = useRoomModal((state) => state)
  const [isLoading, setIsLoading] = useState(false)
  const [roomData, setRoomData] = useState<any>(null)
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });

  const handleSelect = (ranges: any) => {
    // Update the state with the new range
    setSelectedRange(ranges.selection);
  };

  useEffect(() => {
    if (!roomModal.isOpen || !roomModal.roomId) {
      return
    }

    console.log(`Start loading room modal ${roomModal.roomId}`)
    setIsLoading(true)

    fetch(`https://hotel-tma.zeabur.app/api/room/${roomModal.roomId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json())
      .then((data) => {
        setIsLoading(false)
        console.log(data)
        setRoomData(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [roomModal.isOpen]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <div className={'flex flex-col'}>
        <h2 className={'text-xl'}>{roomData?.description}</h2>
        <span>Room type: {roomData?.room_type.name}</span>
        <span>Sleeps: {roomData?.adults} adults {roomData?.children ? `and ${roomData?.children} children` : ""}</span>
      </div>

      <DateRange
        rangeColors={['#262626']}
        ranges={[selectedRange]}
        date={new Date()}
        onChange={handleSelect}
        direction="vertical"
        showDateDisplay={false}
        minDate={new Date()}
      />
    </div>
  )


  const footerContent = (
    <div className="text-neutral-400 text-center mt-4">

    </div>
  )


  return (
    <Modal
      disabled={!roomData?.is_available}
      isOpen={roomModal.isOpen}
      title={roomData ? roomData.name : "Loading..."}
      actionLabel="Book"
      onClose={roomModal.onClose}
      body={bodyContent}
      footer={footerContent}
      onSubmit={() => {
      }}/>
  )
}

export default RoomModal;