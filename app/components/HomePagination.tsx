'use client';


import {Pagination} from "@nextui-org/pagination";
import {useRouter} from "next/navigation";
import qs from "query-string";

export default function HomePagination(
  {page, pages}: { page: number, pages: number }
) {

  const router = useRouter()

  const handlePageChange = (page: number) => {
    let currentQuery = {};

    const updatedQuery: any = {
      ...currentQuery,
      page: page
    };

    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery,
    }, {skipNull: true});

    router.push(url);
  }

  return (
    <div className="flex w-full justify-center">
      <Pagination
        isCompact
        showControls
        showShadow
        color="secondary"
        page={page}
        total={pages}
        onChange={(page) => handlePageChange(page)}
      />
    </div>)
}