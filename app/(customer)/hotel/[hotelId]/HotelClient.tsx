"use client";

import {useEffect, useState} from "react";
import ListingHead from "@/app/components/listings/ListingHead";
import Container from "@/app/components/Container";
import {ListingRoom} from "@/app/components/listings/ListingRoom";
import Loader from "@/app/components/Loader";
import {MdDone} from "react-icons/md";
import {Card} from "@nextui-org/card";
import Review from "@/app/components/Review";
import {useRouter} from "next/navigation";

const HotelClient = ({listing}: any) => {

  const [isClient, setIsClient] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const route = useRouter()

  if (!listing || listing === 'undefined') {
    route.push('/')
  }


  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <Container>
      {!isClient ? <Loader/> : (
        <div className="max-w-screen-lg mx-auto">
          <div className="flex flex-col gap-6">
            <ListingHead
              title={listing?.name}
              imageSrc={listing?.image}
              location={listing?.city}
              id={listing?.id}
              currentUser={null}
            />


            <Card className={'p-4'} >
              <h2 className="text-2xl font-bold">Description</h2>
              {isShow ? (
                <p>{listing?.description}</p>
              ):(
                <p className={'line-clamp-3'}>{listing?.description}</p>
              )}
              <div className={'cursor-pointer font-bold'} onClick={() => setIsShow(!isShow)}>
                {isShow ? 'Show less' : 'Show more'}
              </div>
            </Card>

            {listing?.features?.length > 0 && (
              <Card className={'p-4'}>
                <h2>Features</h2>
                <div className={'grid'}>
                  {listing.features.map((feature: any, index: number) => (
                    <div key={index} className={'flex items-center gap-2'}>
                      <MdDone/>
                      <p>{feature?.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <ListingRoom
              rooms={listing?.room_set} currency={listing?.city?.province?.country?.currency}
            />

            <Review hotelId={listing?.id}></Review>
          </div>
        </div>
      )}
    </Container>
  )
}

export default HotelClient