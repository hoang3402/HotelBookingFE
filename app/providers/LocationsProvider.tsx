"use client";

import {useLocation} from "@/app/hooks/useCountries";
import {useEffect} from "react";

const LocationsProvider = () => {
  const {countries, provinces, cities, fetchCountries, fetchProvinces, fetchCities} = useLocation()

  useEffect(() => {
    if (!countries.length) {
      fetchCountries()
    }
    if (!provinces.length) {
      fetchProvinces()
    }
    if (!cities.length) {
      fetchCities()
    }
  }, []);

  return <></>
}

export default LocationsProvider