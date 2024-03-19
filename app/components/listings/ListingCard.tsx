'use client';

import Image from "next/image";
import {useRouter} from "next/navigation";
import React, {useCallback} from "react";
import HeartButton from "../HeartButton";
import Button from "../Button";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {HotelData} from "@/app/type";

interface ListingCardProps {
  data: HotelData;
  reservation?: any;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
}

const ListingCard: React.FC<ListingCardProps> = ({
                                                   data,
                                                   onAction,
                                                   disabled,
                                                   actionLabel,
                                                   actionId = '',
                                                 }) => {
  const router = useRouter();
  const currentUser = useAuthUser()

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId)
    }, [disabled, onAction, actionId]);

  return (
    <div
      onClick={() => router.push(`/hotel/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div
          className="
            aspect-square 
            w-full 
            relative 
            overflow-hidden 
            rounded-xl
          "
        >
          <Image
            fill
            className="
              object-cover 
              h-full 
              w-full 
              group-hover:scale-110 
              transition
            "
            src={data.image}
            alt="Listing"
            sizes={'600'}
          />
          <div className="
              absolute
              top-3
              right-3
            "
          >
            <HeartButton
              listingId={data.id}
              currentUser={currentUser}
            />
          </div>
        </div>
        <div className="font-semibold text-lg">
          {data.name}
        </div>
        <div className="font-light text-neutral-500">
          {data.province.name}, {data.province.country.name}
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

export default ListingCard;