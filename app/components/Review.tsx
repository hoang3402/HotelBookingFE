"use client"

import React, {useEffect, useState} from "react";
import {domain} from "@/app/actions/getRoomById";
import {Result, Review} from "@/app/type";
import {Card} from "@nextui-org/card";
import Loader from "@/app/components/Loader";
import {MdOutlineStar} from "react-icons/md";
import Avatar from "@/app/components/Avatar";

const ReviewItem = ({data}: { data: Review }) => {
  return (
    <Card className={'p-4 hover:bg-neutral-100 hover:shadow'}>
      <div className={'flex gap-4'}>
        <div className={'hidden md:block'}>
          <Avatar src={null}/>
        </div>
        <div className={'w-full'}>
          <div className={'flex items-center justify-items-center gap-1 text-center'}><p>{data?.rating}</p>
            <MdOutlineStar/></div>
          <p>{data?.comment}</p>
          <p className={'text-end'}>{new Date(data?.created_at).toDateString()}</p>
        </div>
      </div>
    </Card>
  )
}

const Reviews = ({hotelId}: any) => {

  const [isLoading, setIsLoading] = useState(true)
  const [totalReview, setTotalReview] = useState(0)
  const [review, setReview] = useState<any>([])

  useEffect(() => {
    fetch(`${domain}api/comment/?hotelId=${hotelId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json())
      .then((data: Result) => {
        setTotalReview(data.count)
        setReview(data.results)
        setIsLoading(false)
      })
  }, [])

  return (
    <div>
      {review.length > 0 ? (
        <>
          <h2 className={'text-2xl font-bold'}>{totalReview} reviews</h2>
          <Card className={'p-4 flex flex-col gap-4'}>
            {isLoading ? <Loader/> : (
              review.map((item: any) => (
                <ReviewItem key={item.id} data={item}/>
              ))
            )}
          </Card>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Reviews