import useSignOut from "react-auth-kit/hooks/useSignOut";
import SideBarItem from "@/app/components/sidebar/SideBarItem";
import {toast} from "react-hot-toast";
import {IoMdArrowBack} from "react-icons/io";

export default function SideBar({user, route}: any) {
  const logout = useSignOut()

  function handleLogout() {
    let _ = logout()
    if (_) {
      toast.success("Logout successfully")
      route.push('/')
    } else {
      toast.error("Logout failed")
    }
  }

  function handleBack() {
    route.push('/')
  }

  function handleSelect() {
    route.push('/manager/booking')
  }

  return (
    <>
      <span
        className="absolute text-white text-4xl top-5 left-4 cursor-pointer"
        onClick={() => {
        }}
      >
        <i className="bi bi-filter-left px-2 bg-gray-900 rounded-md"></i>
      </span>
      <div
        className="sidebar fixed top-0 bottom-0 lg:left-0 p-2 w-1/4 overflow-y-auto text-center bg-gray-900"
      >
        <div className="text-gray-100 text-xl">
          <div className="p-2.5 mt-1 flex items-center">
            <IoMdArrowBack
              className="cursor-pointer"
              onClick={handleBack}
            />
            <h1 className="font-bold text-gray-200 ml-3 truncate">Hello {user.role}</h1>
            <i
              className="bi bi-x cursor-pointer lg:hidden"
              onClick={() => {
              }}
            ></i>
          </div>
          <div className="my-2 bg-gray-600 h-[1px]"></div>
        </div>
        <div
          className="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-gray-700 text-white"
        >
          <i className="bi bi-search text-sm"></i>
          <input
            type="text"
            placeholder="Search"
            className="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
          />
        </div>
        <SideBarItem label={'Booking'} onClick={handleSelect}/>
        <div className="my-4 bg-gray-600 h-[1px]"></div>
        <SideBarItem label={'Logout'} onClick={handleLogout}/>
      </div>
    </>
  )
}
