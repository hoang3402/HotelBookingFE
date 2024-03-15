"use client";

import NextAuth from "@auth-kit/next";
import Container from "@/app/components/Container";
import Loader from "@/app/components/Loader";
import React, {useEffect, useState} from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {Input} from "@nextui-org/input";
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {useLocation} from "@/app/hooks/useCountries";

const CreateHotelPage = () => {
  const user: any = useAuthUser()
  const [isLoading, setIsLoading] = useState(false)
  const {provinces, fetchProvinces} = useLocation()

  useEffect(() => {

    // Start get country
    fetchProvinces()

    // End get country

    setIsLoading(false)
  }, [])

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
                    defaultItems={provinces}
                    label="Favorite Animal"
                    className="max-w-xs"
                  >
                    {(province) => <AutocompleteItem key={province.id}>{province.name}</AutocompleteItem>}
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