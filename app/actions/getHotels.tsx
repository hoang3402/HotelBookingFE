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

    return fetch(`${process.env.API_URL}api/hotel/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      return res.json()
    }).catch((error) => {
      throw new Error(error);
    })
  } catch (error: any) {
    throw new Error(error);
  }
}
