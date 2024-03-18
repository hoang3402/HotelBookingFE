"use client";


import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import NextAuth from "@auth-kit/next";
import React, {useEffect, useState} from "react";
import Container from "@/app/components/Container";
import Loader from "@/app/components/Loader";
import {domain} from "@/app/actions/getRoomById";
import {toast} from "react-hot-toast";
import ImageUpload from "@/app/components/ImageUpload";
import {Input, Textarea} from "@nextui-org/input";
import {Select, SelectItem} from "@nextui-org/react";
import {FormattedPrice} from "@/app/components/Ultility";
import {Tooltip} from "@nextui-org/tooltip";


const booleanSelect = [
  {
    value: 1,
    label: 'Yes'
  },
  {
    value: 0,
    label: 'No'
  }
]


const ManagerRoomsPage = ({params}: { params: { id: string } }) => {

  const user: any = useAuthUser()
  const [isLoading, setIsLoading] = useState(true)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [adults, setAdults] = useState('')
  const [children, setChildren] = useState('')
  const [price, setPrice] = useState('')
  const [is_available, setIsAvailable] = useState('0')
  const [room_type, setRoomType] = useState('')
  const [image, setImage] = useState('')


  const onSubmit = () => {

    fetch(`${domain}api/room/${params.id}/edit/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    }).then(res => res.json())
      .then(data => {
        if (data.detail) {
          toast.error(data.detail)
          return
        }
        toast.success('Update room success!')
      })
  }

  useEffect(() => {

    setIsLoading(true)

    fetch(`${domain}api/room/${params.id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then(data => {
        setName(data.name)
        setDescription(data.description)
        setAdults(data.adults)
        setChildren(data.children)
        setPrice(data.price)
        setIsAvailable(data.is_available === 'true' ? '1' : '0')
        setImage(data.image)
        setRoomType(data.room_type.id)
        setImage(data.image)
      })

    setIsLoading(false)

  }, [])


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
              <h1 className={'text-3xl font-bold'}>Rooms of </h1>
              <div>
                {isLoading ? (
                  <Loader/>
                ) : (
                  <div className={'flex flex-col gap-4'}>
                    <Input
                      label={'Name room'}
                      required={true}
                      type={"text"}
                      isClearable
                      value={name}
                      onValueChange={setName}
                    />
                    <Textarea
                      label={'Description'}
                      required={true}
                      type={"text"}
                      value={description}
                      onValueChange={setDescription}
                    />
                    <Input
                      label={<Tooltip color={'danger'} content={'The price will be set according to the local currency.'} ><div>Price</div></Tooltip >}
                      required={true}
                      type={"number"}
                      isClearable
                      value={price}
                      onValueChange={setPrice}
                    />
                    <Input
                      label={'Adults'}
                      required={true}
                      type={"number"}
                      isClearable
                      value={adults}
                      onValueChange={setAdults}
                    />
                    <Input
                      label={'Children'}
                      required={true}
                      type={"number"}
                      isClearable
                      value={children}
                      onValueChange={setChildren}
                    />
                    <Select
                      label="Is available?"
                      placeholder=""
                      selectedKeys={is_available}
                      onSelectionChange={(value) => setIsAvailable(value as string)}
                    >
                      {booleanSelect.map((_select: any) => (
                        <SelectItem key={_select.value}>{_select.label}</SelectItem>
                      ))}
                    </Select>
                    <Input
                      label={'Room type'}
                      required={true}
                      type={"text"}
                      isClearable
                      value={room_type}
                      onValueChange={setRoomType}
                    />

                    <div className={'flex justify-center'}>
                      <ImageUpload image={image} setImage={setImage}/>
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

export default ManagerRoomsPage