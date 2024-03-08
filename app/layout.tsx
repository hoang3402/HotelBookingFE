import {Inter, Nunito} from "next/font/google";
import "./globals.css";
import React from "react";
import ClientOnly from "@/app/components/ClientOnly";
import ToasterProvider from "@/app/providers/ToasterProvider";
import Navbar from "@/app/components/navbar/Navbar";

const inter = Inter({subsets: ["latin"]});

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
    <body className={font.className}>
      <ClientOnly>
        <ToasterProvider/>
        <Navbar/>
      </ClientOnly>
      {children}
    </body>
    </html>
  );
}
