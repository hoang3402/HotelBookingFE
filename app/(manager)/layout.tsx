import "@/app/globals.css";
import {Nunito} from "next/font/google";
import React from "react";
import AuthProvider from "react-auth-kit";
import store from "@/app/store";
import ToasterProvider from "@/app/providers/ToasterProvider";
import ClientOnly from "@/app/components/ClientOnly";
import SideBar from "@/app/components/sidebar/SideBar";
import {SidebarItem} from "@/app/components/sidebar/SideBarItem";
import {FaHome, FaHotel, FaUserAlt} from "react-icons/fa";
import {IoTicket} from "react-icons/io5";
import LocationsProvider from "@/app/providers/LocationsProvider";

export const metadata = {
  title: 'Dashboard Hotel booking',
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
        <LocationsProvider/>
      </ClientOnly>
      <div className={'flex'}>
        <SideBar>
          <SidebarItem icon={<FaHome/>} text={'Home'} path={'/manager'}/>
          <SidebarItem icon={<FaHotel/>} text={'Hotel'} path={'/manager/hotel'}/>
          <SidebarItem icon={<IoTicket/>} text={'Booking'} path={'/manager/booking'}/>
          <SidebarItem icon={<FaUserAlt/>} text={'User'} path={'/manager/user'}/>
        </SideBar>
        <div className={'flex-1'}>
          {children}
        </div>
      </div>
      </body>
      </html>
    </AuthProvider>
  );
}
