import {domain} from "@/app/actions/getRoomById";

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
}

export default async function getHotels(
  params: IListingsParams
) {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      locationValue,
      startDate,
      endDate,
    } = params;

    return fetch(`${domain}api/search/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "keyword": "",
        "adults": "",
        "children": "",
        "country": locationValue,
        "city": "",
        "province": "",
        "check_in_date": startDate,
        "check_out_date": endDate
      })
    }).then((res) => {
      return res.json()
    }).catch((error) => {
      throw new Error(error);
    })
  } catch (error: any) {
    throw new Error(error);
  }
}
