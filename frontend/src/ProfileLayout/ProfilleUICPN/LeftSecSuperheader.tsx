import { Button } from '@headlessui/react';
import ButtonSettingProfileUI from './ButtonSuperHeaderCPN/ButtonSettingProfileUI';
import ButtonCoppyAddress from './ButtonSuperHeaderCPN/ButtonCoppyAddress';
import ButtonReportUser from './ButtonSuperHeaderCPN/ButtonReportUser';
import { useAuth } from '../../../Auth/AuthContext';

const LeftSecSuperheader = () => {
  const { isLoggedIn, address, avatarUrl, username } = useAuth();
  function shortenAddress(addr: string) {
    return addr.slice(0, 6);
  }
   function shortenAddressTrim(addr: string) {
    return addr.slice(2, 8);
  }

  // Removed useEffect for checking connection as address is now from useAuth

  return (
    <>
      <div className="flex gap-3 ">
         <div>
            
        <button className=" cursor-pointer">
          <img
      src={isLoggedIn && avatarUrl ? avatarUrl : "/defaultava.png"}
      alt="Token Avatar"
      className="w-12 h-12 rounded-full object-cover "
    />
        </button>
         </div>
       <div className=" space-y-1 ">    
           <div className="flex min-w-0 items-center gap-5">
             <div className='max-w-full truncate break-all border-r-[1.5px] border-white/10 pr-5     opacity-100 ' tabIndex={-1}>
               <h1 className='font-bold text-white text-xl leading-tight min-w-0 select-text truncate text-heading-sm'>
                 {isLoggedIn && address ? shortenAddress(address) : ' Wallet Disconnected 🔌'}
               </h1>
             </div>
             <div className='flex min-w-0 items-center gap-5'>
                <ButtonSettingProfileUI></ButtonSettingProfileUI>
                <ButtonCoppyAddress></ButtonCoppyAddress>
                <ButtonReportUser></ButtonReportUser>
             </div>

           </div>
         <div className=' '>
          
            <span className="flex items-center h-[20px] w-fit whitespace-nowrap rounded px-1.5 border border-[#181C14] bg-[#3E3F29]/50 opacity-100 uppercase text-[13px] text-white font-extralight "> {isLoggedIn && address ? shortenAddressTrim(address) : ' Wallet Disconnected 🔌'} </span>
         
      </div>
      </div>
      </div>
    </>
  )
}

export default LeftSecSuperheader