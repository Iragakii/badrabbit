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
            <div className="flex w-full justify-between items-center px-4 pl-15">
                <div className="rounded-md border border-[#181C14] pl-3 w-80 flex items-center cursor-pointer flex-shrink-0">
                    <FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "#ffffff",}} />
                    <SearchInput></SearchInput>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isLoggedIn ? (
                    <WhenUserLogContainer />
                  ) : (
                    <>
                      <ConnectWallet />
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