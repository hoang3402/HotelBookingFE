"use client"

import {HotelData, Result} from "@/app/type";
import ListingCard from "@/app/components/listings/ListingCard";
import React from "react";
import {useRouter, useSearchParams} from "next/navigation";
import qs from "query-string";
import {Pagination} from "@nextui-org/pagination";

const HomeClient = ({hotels}: { hotels: Result }) => {
  const [page, setPage] = React.useState(1);
  const params = useSearchParams();
  const totalPages = Math.ceil(hotels.count / 12)
  const route = useRouter();

  const handlePageChange = (page: number) => {
    setPage(page)
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
  }

  return (
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
  )
}


export default HomeClient