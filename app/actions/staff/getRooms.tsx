import {domain} from "@/app/actions/getRoomById";
import {Result} from "@/app/type";

export async function getRooms(token: string, page: number, page_size: number) {
  return fetch(`${domain}api/room/?page=${page}&page_size=${page_size}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${token}`
    }
  })
    .then((res) => res.json())
    .then((data: Result) => {
      return data;
    })
}