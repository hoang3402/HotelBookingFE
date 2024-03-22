import {domain} from "@/app/actions/getRoomById";

export interface IListingsParams {
  keyword?: string;
  country?: string;
  province?: string;
  city?: string;
  adultsCount?: number;
  childrenCount?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
}

export default async function getHotels(
  params: IListingsParams
) {
  try {
    const {
      keyword,
      adultsCount,
      childrenCount,
      country,
      province,
      city,
      startDate,
      endDate,
      page
    } = params;

    return fetch(`${domain}api/search/?page=${page ?? '1'}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "keyword": keyword ? keyword : "",
        "adults": adultsCount ? adultsCount : 1,
        "children": childrenCount ? childrenCount : 0,
        "country": country,
        "city": city ?? "",
        "province": province ?? "",
        "check_in_date": startDate,
        "check_out_date": endDate
      }),
      cache: "no-store"
    }).then((res) => {
      return res.json()
    }).catch((error) => {
      throw new Error(error);
    })
  } catch (error: any) {
    throw new Error(error);
  }
}
