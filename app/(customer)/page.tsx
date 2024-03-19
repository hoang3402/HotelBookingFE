'use client';


import React, {useEffect} from "react";
import getHotels, {IListingsParams} from "@/app/actions/getHotels";
import ListingCard from "@/app/components/listings/ListingCard";
import Container from "@/app/components/Container";
import {HotelData, Result} from "@/app/type";
import {Pagination} from "@nextui-org/pagination";
import qs from "query-string";
import Loader from "@/app/components/Loader";
import {useRouter} from "next/navigation";

interface HomeProps {
  searchParams: IListingsParams
}

const Home = ({searchParams}: HomeProps) => {
  const [listings, setListings] = React.useState<Result | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const route = useRouter();
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(1);

  useEffect(() => {
    setIsLoading(true)
    getHotels(searchParams).then((data) => {
      setListings(data)
      setPages(Math.ceil(data.count / 12))
      setIsLoading(false)
    })
  }, [page, searchParams]);

  function handlePageChange(page: number) {
    setPage(page)
    setIsLoading(true)
    let currentQuery = {};

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
    <Container>
      <div className={'flex flex-col gap-5'}>
        {isLoading ? (
          <Loader/>
        ) : (
          <>
            <div className={'w-full flex justify-end font-bold text-xl'}>
              {listings && (
                <div>Number hotel available: {listings.count}</div>
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
              {listings && listings.results.map((listing: HotelData, index) => (
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
                total={pages}
                onChange={(page) => handlePageChange(page)}
              />
            </div>
          </>
        )}
      </div>
    </Container>
  );
}

export default Home