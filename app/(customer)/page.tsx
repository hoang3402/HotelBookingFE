import React from "react";
import getHotels, {IListingsParams} from "@/app/actions/getHotels";
import ListingCard from "@/app/components/listings/ListingCard";
import ClientOnly from "@/app/components/ClientOnly";
import Container from "@/app/components/Container";
import {HotelData, Result} from "@/app/type";

interface HomeProps {
  searchParams: IListingsParams
}

const Home = async ({searchParams}: HomeProps) => {
  const listings: Result = await getHotels(searchParams);

  return (
    <ClientOnly>
      <Container>
        <div className={'w-full flex justify-end font-bold text-xl'}>
          {listings && (
            <div>Number hotel available: {listings.count}</div>
          )}
        </div>
        <div
          className="
            pt-24
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
          {listings.results.map((listing: HotelData) => (
            <ListingCard
              key={listing.id}
              data={listing}
            />
          ))}
        </div>
      </Container>
    </ClientOnly>
  );
}

export default Home