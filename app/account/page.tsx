import Container from "@/app/components/Container";
import {router} from "next/client";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

export default function Page() {
  const user = useAuthUser()

  if (!user) {
    router.push('/')
    return
  }

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <h1>Profile</h1>
      </div>
    </Container>
  )
}