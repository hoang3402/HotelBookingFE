'use client';

import Container from "@/app/components/Container";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import NextAuth from "@auth-kit/next";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import { Card } from "@nextui-org/card";
import { User } from "@/app/type";
import { useEffect, useState } from "react";
import Loader from "@/app/components/Loader";

export default function Page() {

  const user: User | null = useAuthUser()
  const route = useRouter()
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    setIsLoading(false)
  }, [])


  return (
    <NextAuth fallbackPath={'/'}>
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="max-w-screen-lg mx-auto">
            <Card className={'p-10'}>
              <h1 className={'text-3xl'}>Profile</h1>
              <div className={'rounded-2xl p-4'}>
                <p>Name: {user?.first_name} {user?.last_name}</p>
                <p>Email: {user?.email}</p>
                <p>Phone: {user?.number_phone}</p>

                {user?.role !== 'user' && (
                  <div>
                    <p>Role: {user?.role}</p>
                    <div className={'w-[200px] my-4'}>
                      <Button
                        onClick={() => {
                          route.push('/manager')
                        }}
                        label={'Go to manager'}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </Container>
    </NextAuth>
  )
}