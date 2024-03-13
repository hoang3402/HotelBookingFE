import NextAuth from "@auth-kit/next";
import ManagerClient from "@/app/manager/ManagerClient";

const ManagerPage = () => {
  return (
    <NextAuth fallbackPath={'/'}>
      <ManagerClient/>
    </NextAuth>
  )
}

export default ManagerPage