import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import SearchInput from "./HeaderCPN/SearchInput"
import ConnectWallet from "./HeaderCPN/ConnectWallet"
import UserIconNotLog from "./HeaderCPN/UserIconNotLog"

import { useAuth } from "../../../Auth/AuthContext"

import WhenUserLogContainer from "./HeaderCPN/WhenUserLoginCPN/WhenUserLogContainer"



const Header = () => {
  const { isLoggedIn } = useAuth();

  return (
    <>
     <div>
        <header className=" bg-[#0C0C0C] text-white py-2 z-50 border-b border-[#181C14]">
            <div className=" flex container mx-auto justify-between">
                <div className="rounded-md border border-[#181C14] pl-3 w-80">
                    <FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "#ffffff",}} />
                    <SearchInput></SearchInput>
                </div>
                <div className="flex items-center">
                  {isLoggedIn ? (
                    <WhenUserLogContainer />
                  ) : (
                    <>
                      <button className="border-r border-r-[#181C14] pr-1 mr-2 ">
                        <ConnectWallet />
                      </button>
                      <UserIconNotLog />
                    </>
                  )}
                </div>
            </div>
        </header>
     </div>
    </>
  )
}

export default Header