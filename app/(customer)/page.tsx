import Container from "@/app/components/Container";
import HelpWidget from "@/app/components/chatbot/HelpWidget";
import HomeClient from "@/app/(customer)/HomeClient";
import {Suspense} from "react";
import Loader from "@/app/components/Loader";


const Home = () => {

  return (
    <Container>
      <Suspense fallback={<Loader/>}>
        <div className={'flex flex-col gap-5'}>
          <HomeClient/>
        </div>
      </Suspense>
      <HelpWidget/>
    </Container>
  );
}

export default Home