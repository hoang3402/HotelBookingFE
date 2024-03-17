import {domain} from "@/app/actions/getRoomById";


export default async function getUsers(token: string) {
  const res = await fetch(`${domain}api/auth/user/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${token}`
    },
    cache: "no-store"
  });
  return await res.json();
}