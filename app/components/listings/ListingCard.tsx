'use client';

import Image from "next/image";
import {useRouter} from "next/navigation";
import React, {useCallback, useMemo} from "react";
import {format} from 'date-fns';
import HeartButton from "../HeartButton";
import Button from "../Button";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

interface ListingCardProps {
  data: any;
  reservation?: any;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
}

const ListingCard: React.FC<ListingCardProps> = ({
                                                   data,
                                                   reservation,
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
          />
          <div className="
            absolute
            top-3
            right-3
          ">
            <HeartButton
              listingId={data.id}
              currentUser={currentUser}
            />
          </div>
        </div>
        <div className="font-semibold text-lg">
          {/*{location?.region}, {location?.label}*/}
          {data.name}
        </div>
        <div className="font-light text-neutral-500">
          {/*{reservationDate || data.category}*/}
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