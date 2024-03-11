import React from "react";
import ListingHead from "@/app/components/listings/ListingHead";
import Container from "@/app/components/Container";
import {ListingRoom} from "@/app/components/listings/ListingRoom";

const HotelClient = ({listing}: any) => {
  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing?.name}
            imageSrc={listing?.image}
            location={listing?.province}
            id={listing?.id}
            currentUser={null}
          />
          <ListingRoom
            rooms={listing.room_set} currency={listing.province?.country?.currency}
          />
        </div>
      </div>
    </Container>
  )
}

export default HotelClient