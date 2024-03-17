import {domain} from "@/app/actions/getRoomById";
import {Result} from "@/app/type";
import {toast} from "react-hot-toast";


export async function getBookings(token: string) {
  try {
    return fetch(`${domain}api/staff/booking/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      },
      cache: "no-store",
    }).then(res => res.json())
      .then((res: Result) => {
        return res;
      })
      .catch(error => console.error("Error fetching data:", error));
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getBookingById(id: string, token: string) {
  return fetch(`${domain}api/staff/booking/${id}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${token}`
    }
  }).then(res => {
    return res.json()
  })
    .catch(err => {
      console.log(err)
      toast.error(err)
    })
}