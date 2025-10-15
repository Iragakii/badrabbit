import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlack } from "@fortawesome/free-brands-svg-icons";
import Link from "@mui/material/Link";

const NavBar = () => {
  return (
    <>
      <div>
        <nav className="group fixed left-0 bg-[#0C0C0C] text-white h-screen border-r border-[#181C14] w-[55px] hover:w-[200px] transition-all duration-300 ease-in-out z-[1000]">
          <div className="container p-2 pt-4 overflow-hidden">
            <Link href="/" underline="none">
              <button className="mb-5 flex items-center gap-3 cursor-pointer whitespace-nowrap w-full">
                <img
                  src="/brand-logo.jpg" 
                  alt="Brand Logo"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-bold text-[#ffffff] text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  BadRabbit
                </span>
              </button>
            </Link>
            <div className="mt-4">
              <ul className="space-y-2">
                <div className="flex items-center hover:bg-[#3A6F43] p-2 rounded cursor-pointer">
                  <div className="w-8 flex-shrink-0">
                    <FontAwesomeIcon icon={faSlack} className="w-5 h-5"/>
                  </div>
                  <li className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Discover
                  </li>
                </div>
                <div className="flex items-center hover:bg-[#3A6F43] p-2 rounded cursor-pointer">
                  <div className="w-8 flex-shrink-0">
                    <FontAwesomeIcon icon={faSlack} className="w-5 h-5"/>
                  </div>
                  <li className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Discover
                  </li>
                </div>
                <div className="flex items-center hover:bg-[#3A6F43] p-2 rounded cursor-pointer">
                  <div className="w-8 flex-shrink-0">
                    <FontAwesomeIcon icon={faSlack} className="w-5 h-5"/>
                  </div>
                  <li className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Discover
                  </li>
                </div>
                <div className="flex items-center hover:bg-[#3A6F43] p-2 rounded cursor-pointer">
                  <div className="w-8 flex-shrink-0">
                    <FontAwesomeIcon icon={faSlack} className="w-5 h-5"/>
                  </div>
                  <li className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Discover
                  </li>
                </div>
                <div className="flex items-center hover:bg-[#3A6F43] p-2 rounded cursor-pointer">
                  <div className="w-8 flex-shrink-0">
                    <FontAwesomeIcon icon={faSlack} className="w-5 h-5"/>
                  </div>
                  <li className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Discover
                  </li>
                </div>
                <div className="flex items-center hover:bg-[#3A6F43] p-2 rounded cursor-pointer">
                  <div className="w-8 flex-shrink-0">
                    <FontAwesomeIcon icon={faSlack} className="w-5 h-5"/>
                  </div>
                  <li className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Discover
                  </li>
                </div>
                <div className="flex items-center hover:bg-[#3A6F43] p-2 rounded cursor-pointer">
                  <div className="w-8 flex-shrink-0">
                    <FontAwesomeIcon icon={faSlack} className="w-5 h-5"/>
                  </div>
                  <li className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Discover
                  </li>
                </div>
                
              </ul>
            </div>
            <div className="mt-4 border-t border-[#181C14] pt-4">
              <ul className="space-y-2">
                <div className="flex items-center hover:bg-[#3A6F43] p-2 rounded cursor-pointer">
                  <div className="w-8 flex-shrink-0">
                    <FontAwesomeIcon icon={faSlack} className="w-5 h-5"/>
                  </div>
                  <li className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Settings
                  </li>
                </div>
                
                 <div className="flex items-center hover:bg-[#3A6F43] p-2 rounded cursor-pointer">
                  <div className="w-8 flex-shrink-0">
                    <FontAwesomeIcon icon={faSlack} className="w-5 h-5"/>
                  </div>
                  <li className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Settings
                  </li>
                </div>
                 <div className="flex items-center hover:bg-[#3A6F43] p-2 rounded cursor-pointer">
                  <div className="w-8 flex-shrink-0">
                    <FontAwesomeIcon icon={faSlack} className="w-5 h-5"/>
                  </div>
                  <li className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Settings
                  </li>
                </div>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default NavBar;
