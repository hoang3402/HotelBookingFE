"use client"

import {Pagination} from "@nextui-org/pagination";
import React from "react";
import qs from "query-string";
import {useRouter} from "next/navigation";

const MyPagination = ({pages}: { pages: number }) => {
  const [page, setPage] = React.useState(1);
  const route = useRouter();

  const handlePageChange = (page: number) => {
    setPage(page)
    let currentQuery = {};

    const updatedQuery: any = {
      ...currentQuery,
      page: page
    };

    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery,
    }, {skipNull: true});

    route.push(url)
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
    </div>
  )
}

export default MyPagination