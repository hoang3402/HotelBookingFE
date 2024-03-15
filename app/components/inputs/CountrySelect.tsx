'use client';

import Select from 'react-select'

import React, {useEffect} from "react";
import {useLocation} from "@/app/hooks/useCountries";

const formatSelectCountry = (option: any) => (
  <div className="flex flex-row items-center gap-3">
    <div>
      {option.code},
      <span className="text-neutral-500 ml-1">
        {option.name}
      </span>
    </div>
  </div>
)

const CountrySelect = ({
                         valueCountry,
                         onChangeCountry,
                         valueProvince,
                         onChangeProvince,
                         valueCity,
                         onChangeCity
                       }: {
  valueCountry?: any;
  onChangeCountry: (value: any) => void;
  valueProvince?: any;
  onChangeProvince: (value: any) => void;
  valueCity?: any;
  onChangeCity: (value: any) => void;
}) => {
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

  const getProvinceByCountry = (code: string) => {
    return provinces.filter((item: any) => item.country.code === code)
  }

  const getCityByProvince = (id: string) => {
    return cities.filter((item: any) => item.province === id)
  }

  return (
    <div className={'divide-y-8'}>
      <Select
        placeholder="Country"
        isClearable
        options={countries}
        value={valueCountry}
        onChange={(value) => onChangeCountry(value)}
        formatOptionLabel={formatSelectCountry}
      />

      <Select
        placeholder="Province"
        isClearable
        options={valueCountry ? getProvinceByCountry(valueCountry.code) : []}
        value={valueProvince}
        onChange={(value) => onChangeProvince(value)}
        formatOptionLabel={(option: any) => (
          <div className="flex flex-row items-center gap-3">
            <div>
              {option.name}
            </div>
          </div>
        )}
      />

      <Select
        placeholder="City"
        isClearable
        options={valueProvince ? getCityByProvince(valueProvince.id) : []}
        value={valueCity}
        onChange={(value) => onChangeCity(value)}
        formatOptionLabel={(option: any) => (
          <div className="flex flex-row items-center gap-3">
            <div>
              {option.name}
            </div>
          </div>
        )}
      />
    </div>
  );
}

export default CountrySelect;