"use client";

import NextAuth from "@auth-kit/next";
import Container from "@/app/components/Container";
import Loader from "@/app/components/Loader";
import React, {useCallback, useEffect, useState} from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {Input, Textarea} from "@nextui-org/input";
import {Autocomplete, AutocompleteItem, Select, SelectItem} from "@nextui-org/react";
import {useLocation} from "@/app/hooks/useCountries";
import {HotelDataDetails, Province, RoomData, User} from "@/app/type";
import FileUploader from "@/app/components/FileUploader";
import Button from "@/app/components/Button";
import {useRouter} from "next/navigation";
import {toast} from "react-hot-toast";
import {domain} from "@/app/actions/getRoomById";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import {getFeaturesByHotelId, getHotelById} from "@/app/actions/staff/getHotels";
import MyTable from "@/app/components/MyTable";
import {SortDescriptor} from "@nextui-org/table";
import {FormattedPrice} from "@/app/components/Ultility";
import {Tooltip} from "@nextui-org/tooltip";
import {EyeIcon} from "@nextui-org/shared-icons";
import {HiMiniXMark} from "react-icons/hi2";
import {useFeatures} from "@/app/hooks/useFeatures";


interface IParams {
  id?: string;
}


const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "adults",
    label: "Adults",
  },
  {
    key: "children",
    label: "Children",
  },
  {
    key: "price",
    label: "Price",
  },
  {
    key: "is_available",
    label: "Is available",
  },
  {
    key: "room_type",
    label: "Room type",
  },
  {
    key: "action",
    label: "Action",
  },
]


const ManagerDetailHotelPage = ({params}: { params: IParams }) => {

  const user: User | null = useAuthUser()
  const token = useAuthHeader()
  const route = useRouter()
  const id = params.id
  const [isLoading, setIsLoading] = useState(true)
  const {countries, provinces} = useLocation()
  const {features, fetchFeatures} = useFeatures()

  const [featuresData, setFeaturesData] = useState<any>()
  const [country, setCountry] = useState<any>()
  const [province, setProvince] = useState<any>()
  const [image, setImage] = useState<string>()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone_number, setPhone_number] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')

  const [rooms, setRooms] = useState<any>([])
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'descending'
  })

  useEffect(() => {

    if (id && id !== '0' && token) {
      fetchFeatures()
      getHotelById(id, token)
        .then((data: HotelDataDetails) => {
          setCountry(data.city.province.country.code)
          setProvince(data.city.province.id)
          setName(data.name)
          setEmail(data.email)
          setPhone_number(data.phone_number)
          setAddress(data.address)
          setDescription(data.description)
          setImage(data.image)

          let _temp: any = []
          data.room_set.forEach((item: RoomData) => {
            _temp.push({
              id: item.id,
              name: item.name,
              description: item.description,
              adults: item.adults,
              children: item.children,
              price: item.price,
              is_available: item.is_available,
              room_type: item.room_type.name,
              currency: item.hotel.city.province.country.currency
            })
          })
          setRooms(_temp)
        })
        .finally(() => {
          setIsLoading(false)
        })
      getFeaturesByHotelId(id)
        .then((data: any) => {
          let _temp: any = []
          data.forEach((item: any) => {
            _temp.push(item.feature)
          })
          setFeaturesData(_temp)
        })
    } else {
      setIsLoading(false)
    }
  }, [isLoading])


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


  const action = (handleDetail: any, handleDelete: any) => {
    return (
      <div className="relative flex items-center gap-2">
        <Tooltip content="Details">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={handleDetail}
        >
          <EyeIcon/>
        </span>
        </Tooltip>
        <Tooltip content="Delete">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={handleDelete}
        >
          <HiMiniXMark color={"red"}/>
        </span>
        </Tooltip>
      </div>
    )
  }


  const handleDetails = (id: number) => {
    route.push(`/manager/room/${id}`)
  }


  const handleDelete = (id: number) => {
    fetch(`${domain}api/room/${id}/delete/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      }
    }).then(res => {
      res.ok ? toast.success('Delete room success!') : toast.error('Delete room failed!')
      setIsLoading(true)
    })
  }


  const renderCell = useCallback((data: any, columnKey: React.Key) => {
    const cellValue: any = data[columnKey as keyof any];
    switch (columnKey) {
      case 'name':
        return <div className={'line-clamp-1'}>{cellValue}</div>
      case 'price':
        return FormattedPrice(cellValue, data.currency)
      case 'description':
        return <div className={'line-clamp-1'}>{cellValue}</div>
      case 'is_available':
        return cellValue ? 'Yes' : 'No'
      case 'action':
        return action(() => handleDetails(data.id), () => handleDelete(data.id));
      default:
        return cellValue
    }
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
              <h1 className={'text-3xl font-bold'}>{id === '0' ? 'Create new' : 'Update'} hotel</h1>
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

                    <div className={'grid grid-cols-2 gap-4'}>
                      <div className={'flex flex-col gap-4 w-full'}>
                        <Autocomplete
                          defaultItems={countries}
                          label="Country"
                          selectedKey={country}
                          onSelectionChange={setCountry}
                        >
                          {(country) =>
                            <AutocompleteItem key={country.code}>
                              {country.name}
                            </AutocompleteItem>}
                        </Autocomplete>

                        <Autocomplete
                          defaultItems={provinces}
                          label="Province"
                          selectedKey={province}
                          onSelectionChange={setProvince}
                        >
                          {getProvinceByCountry(country).map((_province) =>
                            <AutocompleteItem key={_province.id}>
                              {_province.name}
                            </AutocompleteItem>)}
                        </Autocomplete>

                        <Select
                          label="Features"
                          placeholder="Select an feature"
                          selectionMode="multiple"
                          selectedKeys={featuresData}
                          onSelectionChange={setFeaturesData}
                        >
                          {features.map((feature: any) => (
                            <SelectItem key={feature.code} value={feature.code}>
                              {feature.description}
                            </SelectItem>
                          ))}
                        </Select>

                        <Textarea
                          label="Description"
                          placeholder="Enter your description"
                          value={description}
                          onValueChange={setDescription}
                          disableAutosize
                          classNames={{
                            input: "resize-y min-h-[160px]",
                          }}
                        />
                      </div>

                      <div className={'h-[410px]'}>
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

                    <div className={'mt-4'}>
                      <MyTable
                        title={'Rooms'}
                        rows={rooms}
                        columns={columns}
                        sortDescriptor={sortDescriptor}
                        setSortDescriptor={setSortDescriptor}
                        renderCell={renderCell}
                      />
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