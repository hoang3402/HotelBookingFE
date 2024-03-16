import {useRouter} from "next/navigation";
import React, {useCallback, useMemo} from "react";
import {toast} from "react-hot-toast";


import useLoginModal from "./useLoginModal";

interface IUseFavorite {
  listingId: string | any
  currentUser?: any
}

const useFavorite = ({listingId, currentUser}: IUseFavorite) => {
  const router = useRouter();

  const loginModal = useLoginModal();

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];

    return list.includes(listingId);
  }, [currentUser, listingId]);

  const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!currentUser) {
        return loginModal.onOpen();
      }

      try {
        toast.success('Success');
      } catch (error) {
        toast.error('Something went wrong.');
      }
    },
    [
      currentUser,
      hasFavorited,
      listingId,
      loginModal,
      router
    ]);

  return {
    hasFavorited,
    toggleFavorite,
  }
}

export default useFavorite;
