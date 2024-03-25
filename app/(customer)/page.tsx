import getHotels, {IListingsParams} from "@/app/actions/getHotels";
import Container from "@/app/components/Container";
import HelpWidget from "@/app/components/chatbot/HelpWidget";
import HomeClient from "@/app/(customer)/HomeClient";


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
          <HomeClient hotels={hotels}/>
        )}
      </div>
      <HelpWidget/>
    </Container>
  );
}

export default Home