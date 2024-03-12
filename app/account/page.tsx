'use client';

import Container from "@/app/components/Container";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import NextAuth from "@auth-kit/next";

export default function Page() {
  const user: any = useAuthUser()

  return (
    <NextAuth fallbackPath={'/'}>
      <Container>
        <div className="max-w-screen-lg mx-auto border-1">
          <h1>Profile</h1>
          <div className={'rounded-2xl p-4'}>
            <p>Name: {user?.first_name} {user?.last_name}</p>
            <p>Email: {user?.email}</p>
            <p>Phone: {user?.phone}</p>
          </div>
        </div>
      </Container>
    </NextAuth>
  )
}