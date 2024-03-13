'use client';

import Container from "@/app/components/Container";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import NextAuth from "@auth-kit/next";
import {useRouter} from "next/navigation";
import Button from "@/app/components/Button";

export default function Page() {
  const user: any = useAuthUser()
  const route = useRouter()

  return (
    <NextAuth fallbackPath={'/'}>
      <Container>
        <div className="max-w-screen-lg mx-auto border-1">
          <h1>Profile</h1>
          <div className={'rounded-2xl p-4'}>
            <p>Name: {user?.first_name} {user?.last_name}</p>
            <p>Email: {user?.email}</p>
            <p>Phone: {user?.phone}</p>

            {user?.role !== 'user' && (
              <div>
                <p>Role: {user?.role}</p>
                <div className={'w-[200px] my-4'}>
                  <Button
                    onClick={() => {route.push('/manager')}}
                    label={'Go to manager'}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </NextAuth>
  )
}