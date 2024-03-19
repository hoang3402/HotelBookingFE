import {domain} from "@/app/actions/getRoomById";


export default async function getUsers(token: string, page: number,  page_size: number) {
  const res = await fetch(`${domain}api/auth/user/?page=${page}&page_size=${page_size}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${token}`
    },
    cache: "no-store"
  });
  return await res.json();
}