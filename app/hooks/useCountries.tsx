import {domain} from "@/app/actions/getRoomById";
import {Country, Province} from "@/app/type";

import {create} from 'zustand';

interface LocationStore {
  countries: Country[]
  provinces: Province[]
  cities: any
  fetchCountries: () => void
  fetchProvinces: () => void
  fetchCities: () => void
}

export const useLocation = create<LocationStore>((set) => ({
  countries: [],
  provinces: [],
  cities: [],
  fetchCountries: async () => {
    const res = await fetch(`${domain}api/country/`);
    const data = await res.json();
    set({countries: data});
  },
  fetchProvinces: async () => {
    const res = await fetch(`${domain}api/province/`);
    const data = await res.json();
    set({provinces: data});
  },
  fetchCities: async () => {
    const res = await fetch(`${domain}api/city/`);
    const data = await res.json();
    set({cities: data});
  },
}));

