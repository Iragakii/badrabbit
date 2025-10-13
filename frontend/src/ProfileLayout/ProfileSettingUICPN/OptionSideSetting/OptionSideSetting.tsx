import React, { useState } from "react";
import { Link } from "react-router-dom";

const OptionSideSetting = () => {
  const [active, setActive] = useState('Profile');

  return (
    <>
      <div className="text-gray-500 text-sm font-extrabold flex-col flex space-y-7 group">
        <span className="!text-gray-500 !font-extralight">Settings</span>
        <div className="flex-col flex space-y-4 w-60">
          <Link to="" className={active === 'Profile' ? "flex gap-2 items-center p-2  bg-[#181818] rounded-md border-none text-white cursor-pointer" : "flex gap-2 items-center p-2 hover:bg-[#181818] hover:rounded-md hover:border-none hover:text-white cursor-pointer"} onClick={() => setActive('Profile')} onMouseEnter={() => setActive('Profile')}>
            <img src="/user-avatar-profile.svg" alt="" className={active === 'Profile' ? "w-6 h-6 text-white" : "w-6 h-6 text-gray-500 hover:text-white"} />
            <span>Profile</span>
          </Link>
          <Link to="" className={active === 'Linked Wallet' ? "flex gap-2 items-center p-2 bg-[#181818] rounded-md border-none text-white cursor-pointer" : "flex  gap-2 items-center p-2 hover:bg-[#181818] hover:rounded-md hover:border-none hover:text-white cursor-pointer"} onClick={() => setActive('Linked Wallet')} onMouseEnter={() => setActive('Linked Wallet')}>
            <img src="/public/settingprofile/wallet.svg" className="w-5 h-5"></img>
            <span>Linked Wallet</span>
          </Link>
          <Link to="" className={active === 'Email Notifications' ? "flex gap-2 items-center p-2 bg-[#181818] rounded-md border-none text-white cursor-pointer" : "flex gap-2 items-center p-2 hover:bg-[#181818] hover:rounded-md hover:border-none hover:text-white cursor-pointer"} onClick={() => setActive('Email Notifications')} onMouseEnter={() => setActive('Email Notifications')}>
           <img src="/public/settingprofile/mail.svg" className="w-5 h-5"></img>
            <span>Email Notifications</span>

          </Link>
          <Link to="" className={active === 'Developer' ? "flex gap-2 items-center p-2 bg-[#181818] rounded-md border-none text-white cursor-pointer" : "flex items-center  gap-2 p-2 hover:bg-[#181818] hover:rounded-md hover:border-none hover:text-white cursor-pointer"} onClick={() => setActive('Developer')} onMouseEnter={() => setActive('Developer')}>
           <img src="/public/settingprofile/dev-tag.svg" className="w-5 h-5"></img>
            <span>Developer</span>
          </Link>
          <Link to="" className={active === 'Verification' ? "flex gap-2 items-center p-2 bg-[#181818] rounded-md border-none text-white cursor-pointer" : "flex items-center gap-2 p-2 hover:bg-[#181818] hover:rounded-md hover:border-none hover:text-white cursor-pointer"} onClick={() => setActive('Verification')} onMouseEnter={() => setActive('Verification')}>
           <img src="/public/settingprofile/tickverifi.svg" className="w-5 h-5"></img>
            <span>Verification</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default OptionSideSetting;
