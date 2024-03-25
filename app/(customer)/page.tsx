import Container from "@/app/components/Container";
import HelpWidget from "@/app/components/chatbot/HelpWidget";
import HomeClient from "@/app/(customer)/HomeClient";


const Home = () => {

  return (
    <Container>
      <div className={'flex flex-col gap-5'}>
        <HomeClient/>
      </div>
      <HelpWidget/>
    </Container>
  );
}

export default Home