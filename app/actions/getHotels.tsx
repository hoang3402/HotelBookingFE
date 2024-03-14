import {domain} from "@/app/actions/getRoomById";

export interface IListingsParams {
  keyword?: string;
  provinceValue?: string;
  cityValue?: string;
  adultsCount?: number;
  childrenCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
}

export default async function getHotels(
  params: IListingsParams
) {
  try {
    const {
      keyword,
      adultsCount,
      childrenCount,
      locationValue,
      provinceValue,
      cityValue,
      startDate,
      endDate,
    } = params;

    return fetch(`${domain}api/search/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "keyword": keyword ? keyword : "",
        "adults": adultsCount ? adultsCount : 1,
        "children": childrenCount ? childrenCount : 0,
        "country": locationValue,
        "city": cityValue ? cityValue : "",
        "province": provinceValue ? provinceValue : "",
        "check_in_date": startDate,
        "check_out_date": endDate
      }),
      cache: "reload",
    }).then((res) => {
      return res.json()
    }).catch((error) => {
      throw new Error(error);
    })
  } catch (error: any) {
    throw new Error(error);
  }
}
