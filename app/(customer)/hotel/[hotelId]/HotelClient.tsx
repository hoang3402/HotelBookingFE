"use client";

import {useEffect, useState} from "react";
import ListingHead from "@/app/components/listings/ListingHead";
import Container from "@/app/components/Container";
import {ListingRoom} from "@/app/components/listings/ListingRoom";
import Loader from "@/app/components/Loader";

const HotelClient = ({listing}: any) => {

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <Container>
      {!isClient ? <Loader/> : (
        <div className="max-w-screen-lg mx-auto">
          <div className="flex flex-col gap-6">
            <ListingHead
              title={listing?.name}
              imageSrc={listing?.image}
              location={listing?.province}
              id={listing?.id}
              currentUser={null}
            />
            <div>
              <h2 className="text-2xl font-bold">Description</h2>
              <p className="text-lg">
                {listing?.description}
              </p>
            </div>
            <ListingRoom
              rooms={listing?.room_set} currency={listing?.province?.country?.currency}
            />
          </div>
        </div>
      )}
    </Container>
  )
}

export default HotelClient