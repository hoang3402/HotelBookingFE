'use client';

import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useRouter } from "next/navigation";
import Container from "@/app/components/Container";
import { User } from "@/app/type";

const ManagerClient = () => {
  const user: User | null = useAuthUser()
  const route = useRouter()

  if (user && user.role === 'user') route.push('/')

  return (
    <Container>
      <div className={'flex justify-center items-center h-screen'}>
        <span className={'text-3xl'}>Manager</span>
      </div>
    </Container>
  )
}

export default ManagerClient