'use client';

import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {useRouter} from "next/navigation";
import SideBar from "@/app/components/sidebar/SideBar";

const ManagerClient = () => {
  const user: any = useAuthUser()
  const route = useRouter()

  if (user.role === 'user') route.push('/')

  return (
    <div>
      <div className="w-1/3">
        <SideBar user={user} route={route}/>
      </div>
      <div></div>
    </div>
  )
}

export default ManagerClient