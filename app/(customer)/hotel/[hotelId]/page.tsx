import ClientOnly from "@/app/components/ClientOnly";
import React from "react";
import getHotelById from "@/app/actions/getHotelById";
import HotelClient from "@/app/(customer)/hotel/[hotelId]/HotelClient";

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

