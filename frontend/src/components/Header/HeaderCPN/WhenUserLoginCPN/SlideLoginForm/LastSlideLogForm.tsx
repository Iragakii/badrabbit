import { useAuth } from "../../../../../../Auth/AuthContext";




const LastSlideLogForm = () => {
  const { logout } = useAuth();

  return (
    <>
       <button className="flex gap-3 ml-[5px] cursor-pointer" onClick={logout}>
              <img src="/logout.svg" alt="" className="w-5 h-5 " />
                <span className="text-[15px] font-extrabold text-[#DC2525]">Logout</span>
       </button>
    </>
  )
}

export default LastSlideLogForm