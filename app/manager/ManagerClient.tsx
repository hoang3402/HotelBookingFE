'use client';

import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {useRouter} from "next/navigation";

const ManagerClient = () => {
  const user: any = useAuthUser()
  const route = useRouter()

  if (user.role === 'user') route.push('/')

  return (
    <div></div>
  )
}

export default ManagerClient