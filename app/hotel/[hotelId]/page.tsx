import ClientOnly from "@/app/components/ClientOnly";
import React from "react";
import HotelClient from "@/app/hotel/[hotelId]/HotelClient";
import getHotelById from "@/app/actions/getHotelById";

interface IParams {
  hotelId?: string;
}

const HotelPage = async ({params}: { params: IParams }) => {

  const hotel = await getHotelById(params);

  return (
    <ClientOnly>
      <HotelClient listing={hotel}/>
    </ClientOnly>
  )
}

export default HotelPage

