"use client";

import NextAuth from "@auth-kit/next";
import Container from "@/app/components/Container";
import Loader from "@/app/components/Loader";
import React, {useCallback, useEffect, useState} from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {Input, Textarea} from "@nextui-org/input";
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {useLocation} from "@/app/hooks/useCountries";
import {Province, User} from "@/app/type";
import FileUploader from "@/app/components/FileUploader";
import Button from "@/app/components/Button";
import {useRouter} from "next/navigation";
import {toast} from "react-hot-toast";
import {domain} from "@/app/actions/getRoomById";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

interface IParams {
  id?: string;
}

const ManagerDetailHotelPage = ({params}: { params: IParams }) => {
  const user: User | null = useAuthUser()
  const token = useAuthHeader()
  const route = useRouter()
  const id = params.id
  const [isLoading, setIsLoading] = useState(false)
  const {countries, provinces} = useLocation()

  const [country, setCountry] = useState<any>()
  const [province, setProvince] = useState<any>()
  const [image, setImage] = useState<string>()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone_number, setPhone_number] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {

    if (id !== '0') {
      fetch(`${domain}api/hotel/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setProvince(data.province.id)
          setCountry(data.province.country.code)
          setName(data.name)
          setEmail(data.email)
          setPhone_number(data.phone_number)
          setAddress(data.address)
          setDescription(data.description)
          setImage(data.image)
        })
        .catch(err => {
          console.log(err)
          toast.error(err.detail)
        })
    }
    setIsLoading(false)

  }, [])


  const getProvinceByCountry = useCallback((code: string) => {
    return provinces.filter((item: Province) => item.country.code === code)
  }, [provinces])

  const handleCheckInput = () => {
    if (name === '') {
      toast.error('Please enter name')
      return;
    }
    if (email === '') {
      toast.error('Please enter email')
      return;
    }
    if (phone_number === '') {
      toast.error('Please enter phone number')
      return;
    }
    if (address === '') {
      toast.error('Please enter address')
      return;
    }
    if (province === undefined) {
      toast.error('Please select province')
      return;
    }
  }

  const handleCancel = () => {
    route.back()
  }

  const handleCreate = () => {
    handleCheckInput()

    fetch(`${domain}api/hotel/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      },
      body: JSON.stringify({
        name,
        address,
        description,
        province,
        phone_number,
        email,
        image
      }),
    }).then(res => res.json())
      .then(res => {
        if (res.detail) {
          toast.error(res.detail)
        } else {
          toast.success(res.message)
          route.push('/manager/hotel')
        }
      })
      .catch(error => {
        toast.error(error)
      })
  }

  const handleEdit = () => {
    handleCheckInput()

    fetch(`${domain}api/hotel/${id}/edit/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      },
      body: JSON.stringify({
        name,
        address,
        description,
        province,
        phone_number,
        email,
        image
      }),
    }).then(res => res.json())
      .then(res => {
        if (res.detail) {
          toast.error(res.detail)
        } else {
          toast.success("Update hotel success!")
          route.push('/manager/hotel')
        }
      })
  }

  return (
    <div>
      {(user && user.role) !== 'admin' ? (
        <div className={'flex justify-center items-center h-screen'}>
          <span className={'text-3xl'}>You don't have permission</span>
        </div>
      ) : (
        <NextAuth fallbackPath={'/'}>
          <Container>
            <div className={'flex flex-col gap-4 mt-4'}>
              <h1 className={'text-3xl font-bold'}>{id === '0' ? 'Create' : 'Update'} new hotel</h1>
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
                      value={email}
                      onValueChange={setEmail}
                    />
                    <Input
                      label={'Name hotel'}
                      required={true}
                      type={"name"}
                      isClearable
                      value={name}
                      onValueChange={setName}
                    />
                    <Input
                      label={'Phone number'}
                      required={true}
                      type={"phone"}
                      isClearable
                      value={phone_number}
                      onValueChange={setPhone_number}
                    />
                    <Input
                      label={'Address'}
                      required={true}
                      type={"address"}
                      isClearable
                      value={address}
                      onValueChange={setAddress}
                    />

                    <div className={'flex justify-between'}>
                      <div className={'flex flex-col gap-4'}>
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
                          {getProvinceByCountry(country).map((_province) =>
                            <AutocompleteItem key={_province.id}>
                              {_province.name}
                            </AutocompleteItem>)}
                        </Autocomplete>

                        <Textarea
                          label="Description"
                          placeholder="Enter your description"
                          className="max-w-xs"
                          value={description}
                          onValueChange={setDescription}
                          disableAutosize
                          classNames={{
                            base: "max-w-xs w-full",
                            input: "resize-y min-h-[40px]",
                          }}
                        />
                      </div>

                      <div className={'w-[600px] h-[410px]'}>
                        <span className="">Image</span>
                        <FileUploader
                          url={`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_API_KEY_IMAGE_HOST}`}
                          acceptedFileTypes={[
                            "image/png",
                            "image/jpeg",
                          ]}
                          allowMultiple={false}
                          maxFileSize={100}
                          labelAlt="Accepted File Types: png, jpeg"
                          image={image}
                          setImage={setImage}
                        />
                      </div>
                    </div>

                    <div className={'flex gap-4 mt-2 mb-4'}>
                      {id === '0' ? (
                        <Button label={'Create'} onClick={handleCreate}/>
                      ) : (
                        <Button label={'Update'} onClick={handleEdit}/>
                      )}
                      <Button label={'Cancel'} onClick={handleCancel}/>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </Container>
        </NextAuth>
      )}
    </div>
  )
}

export default ManagerDetailHotelPage