import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import SearchInput from "./HeaderCPN/SearchInput"
import UserIcon from "./HeaderCPN/UserIcon"
import ConnectWallet from "./HeaderCPN/ConnectWallet"


const Header = () => {
  return (
    <>
     <div>
        <header className="fixed top-0 left-0 right-0 bg-[#0C0C0C] text-white py-2 z-50 border-b border-[#181C14]">
            <div className="mr-15 flex container mx-auto justify-between">
                <div className="rounded-md border border-[#181C14] pl-3 w-80">
                    <FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "#ffffff",}} />
                    <SearchInput></SearchInput>
                </div>
                <div className="flex items-center">
                   <button className="border-r border-r-[#181C14] pr-1 mr-2 ">
                     <ConnectWallet></ConnectWallet>
                   </button>
                    <UserIcon></UserIcon>
                </div>
            </div>
        </header>
     </div>
    </>
  )
}

export default Header