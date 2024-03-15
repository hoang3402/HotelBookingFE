import {Nunito} from "next/font/google";
import "@/app/globals.css";
import React from "react";
import ClientOnly from "@/app/components/ClientOnly";
import ToasterProvider from "@/app/providers/ToasterProvider";
import Navbar from "@/app/components/navbar/Navbar";
import SearchModal from "@/app/components/modals/SearchModal";
import LoginModal from "@/app/components/modals/LoginModal";
import RegisterModal from "@/app/components/modals/RegisterModal";
import RoomModal from "@/app/components/modals/RoomModal";
import AuthProvider from "react-auth-kit";
import store from "@/app/store";
import LocationsProvider from "@/app/providers/LocationsProvider";

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
    <html lang="en">
    <AuthProvider store={store}>
      <body className={font.className}>
      <ClientOnly>
        <ToasterProvider/>
        <LocationsProvider/>
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
    </AuthProvider>
    </html>
  );
}
