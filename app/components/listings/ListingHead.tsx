'use client';

import Image from "next/image";

import Heading from "../Heading";
import HeartButton from "../HeartButton";
import React from "react";

interface ListingHeadProps {
  title: string;
  location: any;
  imageSrc: string;
  id: string;
  currentUser?: any
}

const ListingHead: React.FC<ListingHeadProps> = ({
                                                   title,
                                                   location,
                                                   imageSrc,
                                                   id,
                                                   currentUser
                                                 }) => {
  console.log(location)
  return (
    <>
      <Heading
        title={title}
        subtitle={`${location?.name}, ${location?.country?.name}`}
      />
      <div className="
          w-full
          h-[60vh]
          overflow-hidden 
          rounded-xl
          relative
        "
      >
        <Image
          src={imageSrc}
          fill
          className="object-cover w-full"
          alt="Image"
        />
        <div
          className="
            absolute
            top-5
            right-5
          "
        >
          <HeartButton
            listingId={id}
            currentUser={currentUser}
          />
        </div>
      </div>
    </>
  );
}

export default ListingHead;