'use client';

import React from "react";
import {LuChevronFirst, LuChevronLast} from "react-icons/lu";
import {FiMoreVertical} from "react-icons/fi";
import {useSideBar} from "@/app/hooks/useSideBar";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {useRouter} from "next/navigation";

export default function SideBar({children}: any) {

  const sideBar = useSideBar()
  const user: any = useAuthUser()
  const route = useRouter()

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="/images/logo.png"
            className={`overflow-hidden transition-all ${
              sideBar.isOpen ? "w-32" : "w-0"
            }`}
            alt=""
            onClick={() => route.push('/')}
          />
          <button
            onClick={sideBar.toggle}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {sideBar.isOpen ? <LuChevronFirst/> : <LuChevronLast/>}
          </button>
        </div>

        <div>
          <ul className="flex-1 px-3">{children}</ul>
        </div>

        <div className="border-t flex p-3">
          <img
            src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${user?.first_name}+${user?.last_name}`}
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${sideBar.isOpen ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">{user?.first_name} {user?.last_name}</h4>
              <span className="text-xs text-gray-600">{user?.email}</span>
            </div>
            <FiMoreVertical size={20}/>
          </div>
        </div>
      </nav>
    </aside>
  )
}
