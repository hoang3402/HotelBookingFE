"use client"

import {HotelData, Result} from "@/app/type";
import ListingCard from "@/app/components/listings/ListingCard";
import React, {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import qs from "query-string";
import {Pagination} from "@nextui-org/pagination";
import getHotels from "@/app/actions/getHotels";
import Loader from "@/app/components/Loader";

const HomeClient = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hotels, setHotels] = useState<any>([]);
  const params = useSearchParams();
  const route = useRouter();

  useEffect(() => {
    setIsLoading(true)
    let currentQuery = qs.parse(params.toString())
    console.log(currentQuery)
    getHotels(currentQuery).then((res: Result) => {
      setTotalPages(Math.ceil(res.count / 12))
      setHotels(res)
      setIsLoading(false)
    })
  }, [params])


  const handlePageChange = (page: number) => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString())
    }

    const updatedQuery: any = {
      ...currentQuery,
      page: page
    };

    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery,
    }, {skipNull: true});

    route.push(url)
    setPage(page)
  }

  return (
    <div>
      {isLoading ? <Loader/> : (
        <div>
          <div className={'w-full flex justify-end font-bold text-xl'}>
            {hotels && (
              <div>Number hotel available: {hotels.count}</div>
            )}
          </div>
          <div
            className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  md:grid-cols-3
                  lg:grid-cols-4
                  xl:grid-cols-5
                  2xl:grid-cols-6
                  gap-8
                "
          >
            {hotels && hotels.results.map((listing: HotelData, index: number) => (
              <ListingCard
                key={`${listing.id + index}${listing.name}`}
                data={listing}
              />
            ))}
          </div>

          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={totalPages}
              onChange={(page) => handlePageChange(page)}
            />
          </div>
        </div>
      )}
    </div>
  )
}


export default HomeClient