import getHotels, {IListingsParams} from "@/app/actions/getHotels";
import ListingCard from "@/app/components/listings/ListingCard";
import Container from "@/app/components/Container";
import {HotelData} from "@/app/type";
import HelpWidget from "@/app/components/chatbot/HelpWidget";
import MyPagination from "@/app/components/MyPagination";


interface HomeProps {
  searchParams: IListingsParams
}


const Home = async ({searchParams}: HomeProps) => {

  const hotels = await getHotels(searchParams);


  return (
    <Container>
      <div className={'flex flex-col gap-5'}>
        {hotels.count < 1 ? (
          <div className={'text-3xl font-bold'}>No hotel found</div>
        ) : (
          <>
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

            <MyPagination pages={Math.ceil((hotels?.count ?? 1) / 12)}/>
          </>
        )}
      </div>
      <HelpWidget/>
    </Container>
  );
}

export default Home