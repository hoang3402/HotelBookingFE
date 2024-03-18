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
import {Tooltip} from "@nextui-org/tooltip";
import {useRoomType} from "@/app/hooks/useRoomType";
import Button from "@/app/components/Button";
import {useRouter} from "next/navigation";


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
  const route = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const {roomTypes} = useRoomType()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [adults, setAdults] = useState('')
  const [children, setChildren] = useState('')
  const [price, setPrice] = useState('')
  const [is_available, setIsAvailable] = useState('0')
  const [room_type, setRoomType] = useState('')
  const [image, setImage] = useState('')


  const handleUpdate = () => {
    fetch(`${domain}api/room/${params.id}/edit/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        description,
        adults,
        children,
        price,
        is_available,
        room_type,
        image
      })
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

    console.log(roomTypes)

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
        setRoomType(`${data.room_type.id}`)
      })

    setIsLoading(false)

  }, [])


  const handleCancel = () => {
    route.back()
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
                      label={<Tooltip color={'danger'}
                                      content={'The price will be set according to the local currency.'}>
                        <div>Price</div>
                      </Tooltip>}
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
                    <Select
                      label="Room type"
                      placeholder=""
                      selectedKeys={room_type}
                      onSelectionChange={(value) => setRoomType(value as string)}
                    >
                      {roomTypes.map((type: any) => (
                        <SelectItem key={type.id}>{type.name}</SelectItem>
                      ))}
                    </Select>

                    <div className={'flex justify-center'}>
                      <ImageUpload image={image} setImage={setImage}/>
                    </div>

                    <div className={'flex gap-4 mt-2'}>
                      <Button label={'Update'} onClick={handleUpdate}/>
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

export default ManagerRoomsPage