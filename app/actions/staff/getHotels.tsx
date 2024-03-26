import {domain} from "@/app/actions/getRoomById";
import {Result} from "@/app/type";
import {toast} from "react-hot-toast";

export async function getHotels(token: string, page: number) {
  return fetch(`${domain}api/hotel/?page=${page}`, {
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

export async function getHotelById(id: string, token: string) {
  return fetch(`${domain}api/hotel/${id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      return data
    })
    .catch(err => {
      console.log(err)
      toast.error(err.detail)
    })
}

export async function getFeaturesByHotelId(id: string) {
  return fetch(`${domain}api/feature-hotel/${id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      return data
    })
    .catch(err => {
      console.log(err)
      toast.error(err.detail)
    })
}