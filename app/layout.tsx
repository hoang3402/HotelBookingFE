import {Nunito} from "next/font/google";
import "./globals.css";
import React from "react";
import ClientOnly from "@/app/components/ClientOnly";
import ToasterProvider from "@/app/providers/ToasterProvider";
import Navbar from "@/app/components/navbar/Navbar";
import SearchModal from "@/app/components/modals/SearchModal";
import LoginModal from "@/app/components/modals/LoginModal";
import RegisterModal from "@/app/components/modals/RegisterModal";
import RoomModal from "@/app/components/modals/RoomModal";
import NextAuth from "@auth-kit/next";
import AuthProvider from "react-auth-kit";
import store from "@/app/store";

export const metadata = {
  title: 'Hotel booking',
  description: 'TMA International - Hotel booking',
}

const font = Nunito({
  subsets: ['latin'],
});

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider store={store}>
      <html lang="en">
      <body className={font.className}>
      <ClientOnly>
        <ToasterProvider/>
        <SearchModal/>
        <LoginModal/>
        <RegisterModal/>
        <RoomModal/>
        <Navbar/>
      </ClientOnly>
      <div className={'pb-20 pt-28'}>
        {children}
      </div>
      </body>
      </html>
    </AuthProvider>
  );
}
