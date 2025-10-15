
import ButtonSettingProfileUI from './ButtonSuperHeaderCPN/ButtonSettingProfileUI';
import ButtonCoppyAddress from './ButtonSuperHeaderCPN/ButtonCoppyAddress';
import ButtonReportUser from './ButtonSuperHeaderCPN/ButtonReportUser';

import ButtonDirectSocialWeb from './ButtonSuperHeaderCPN/ButtonDirectSocialWeb';
import { useAuth } from '../../../../Auth/AuthContext';
import Username from '../../../components/Username/Username';

const LeftSecSuperheader = () => {
  const { isLoggedIn, address, avatarUrl } = useAuth();

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
      className="w-14 h-14 rounded-full object-cover "
    />
        </button>
         </div>
       <div className=" ">    
           <div className="flex min-w-0 items-center gap-5">
              <Username></Username>
             <div className='flex min-w-0 items-center gap-5'>
                <ButtonSettingProfileUI></ButtonSettingProfileUI>
                <ButtonDirectSocialWeb></ButtonDirectSocialWeb>
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