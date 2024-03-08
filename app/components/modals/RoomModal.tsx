"use client";

import Modal from "@/app/components/modals/Modal";
import useRoomModal from "@/app/hooks/useRoomModal";

const RoomModal = () => {
  let roomModal = useRoomModal()


  const bodyContent = (
    <div className="flex flex-col gap-4">

    </div>
  )


  const footerContent = (
    <div className="text-neutral-400 text-center mt-4">

    </div>
  )


  return (
    <Modal
      isOpen={roomModal.isOpen}
      title=""
      actionLabel="Book"
      onClose={roomModal.onClose}
      body={bodyContent}
      footer={footerContent}
      onSubmit={() => {
      }}/>
  )
}

export default RoomModal;