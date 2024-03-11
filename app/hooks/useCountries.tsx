import {useEffect, useState} from 'react';
import {domain} from "@/app/actions/getRoomById";

export const useLocation = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${domain}api/country/`)
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });

    fetch(`${domain}api/province/`)
      .then((res) => res.json())
      .then((data) => {
        setProvinces(data);
      })
      .catch((error) => {
        console.error('Error fetching provinces:', error);
      });

    fetch(`${domain}api/city/`)
      .then((res) => res.json())
      .then((data) => {
        setCities(data);
      })
      .catch((error) => {
        console.error('Error fetching cities:', error);
      });
  }, []);

  const getAll = () => {
    return countries;
  };

  const getByValue = (value: any) => {
    return countries.find((item) => item.code === value);
  };

  const getProvinceByCountry = (value: any) => {
    return provinces.filter((item) => item.country.code === value);
  };

  const getCityByProvince = (value: any) => {
    return cities.filter((item) => item.province === value);
  };

  return {
    countries,
    getAll,
    getByValue,
    getProvinceByCountry,
    getCityByProvince
  };
};