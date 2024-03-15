"use client";

import NextAuth from "@auth-kit/next";
import Container from "@/app/components/Container";
import Loader from "@/app/components/Loader";
import React, {useEffect, useState} from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {Input} from "@nextui-org/input";
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {useLocation} from "@/app/hooks/useCountries";
import {Province} from "@/app/type";
import {IKContext, IKImage, IKUpload} from "imagekitio-react";

const CreateHotelPage = () => {
  const user: any = useAuthUser()
  const [isLoading, setIsLoading] = useState(false)
  const {countries, provinces, cities} = useLocation()
  const [country, setCountry] = useState<any>()
  const [province, setProvince] = useState<any>()
  const [city, setCity] = useState<any>()

  useEffect(() => {
    setIsLoading(false)
  }, [])

  useEffect(() => {
    setProvince(undefined)
    setCity(undefined)
  }, [country])

  useEffect(() => {
    setCity(undefined)
  }, [province])

  const getProvinceByCountry = (code: string) => {
    return provinces.filter((item: Province) => item.country.code === code)
  }

  const getCityByProvince = (id: number) => {
    return cities.filter((item: any) => item.province == id)
  }

  return <div>
    {user?.role !== 'admin' ? (
      <div className={'flex justify-center items-center h-screen'}>
        <span className={'text-3xl'}>You don't have permission</span>
      </div>
    ) : (
      <NextAuth fallbackPath={'/'}>
        <Container>
          <div className={'flex flex-col gap-4 mt-4'}>
            <h1 className={'text-3xl font-bold'}>Create new hotel</h1>
            <div>
              {isLoading ? (
                <Loader/>
              ) : (
                <div className={'flex flex-col gap-4'}>
                  <Input
                    label={'Email'}
                    required={true}
                    type={"email"}
                    isClearable
                  />
                  <Input
                    label={'Name hotel'}
                    required={true}
                    type={"name"}
                    isClearable
                  />
                  <Autocomplete
                    defaultItems={countries}
                    label="Country"
                    className="max-w-xs"
                    selectedKey={country}
                    onSelectionChange={setCountry}
                  >
                    {(country) => <AutocompleteItem key={country.code}>{country.name}</AutocompleteItem>}
                  </Autocomplete>

                  <Autocomplete
                    defaultItems={provinces}
                    label="Province"
                    className="max-w-xs"
                    selectedKey={province}
                    onSelectionChange={setProvince}
                  >
                    {getProvinceByCountry(country).map((province) =>
                      <AutocompleteItem key={province.id}>
                        {province.name}
                      </AutocompleteItem>)}
                  </Autocomplete>

                  <Autocomplete
                    defaultItems={cities}
                    label="City"
                    className="max-w-xs"
                    selectedKey={city}
                    onSelectionChange={setCity}
                  >
                    {getCityByProvince(province).map((_city) =>
                      <AutocompleteItem key={_city.code}>
                        {_city.name}
                      </AutocompleteItem>)}
                  </Autocomplete>
                </div>
              )}
            </div>
          </div>
        </Container>
      </NextAuth>
    )}
  </div>
}

export default CreateHotelPage