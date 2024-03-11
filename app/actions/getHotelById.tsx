import {domain} from "@/app/actions/getRoomById";

interface IParams {
  hotelId?: string;
}

export default async function getHotelById(
  params: IParams
) {
  try {
    const {hotelId} = params;

    if (!hotelId) {
      return null;
    }

    return fetch(`${domain}api/hotel/${hotelId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store"
    }).then((res) => {
      return res.json()
    }).catch((error) => {
      console.log(error)
    });
  } catch (error: any) {
    throw new Error(error);
  }
}
