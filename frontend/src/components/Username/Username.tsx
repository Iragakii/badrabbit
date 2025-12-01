import { useAuth } from "../../../Auth/AuthContext";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getApiUrl } from "../../config/api";

const Username = () => {
      const { isLoggedIn, address , username } = useAuth();
      const { walletaddress } = useParams<{ walletaddress?: string }>();
      const [profileData, setProfileData] = useState<any>(null);
      
      // Determine which wallet address to use - URL param takes precedence
      const displayWallet = walletaddress || address;
      const isOwnProfile = isLoggedIn && address?.toLowerCase() === walletaddress?.toLowerCase();
      
      // Fetch profile data for the wallet address in URL
      useEffect(() => {
        if (displayWallet) {
          fetch(getApiUrl(`api/user/${displayWallet}`))
            .then(res => res.json())
            .then(data => setProfileData(data))
            .catch(err => {
              console.error('Error fetching profile:', err);
              setProfileData(null);
            });
        }
      }, [displayWallet]);
      
      // Use profile data if available, otherwise fall back to logged-in user data
      const displayUsername = profileData?.username || (isOwnProfile ? username : null);
      
      function shortenAddress(addr: string) {
        return addr.slice(0, 6);
      }
     
  return (
    <>
     <div>
         <div className='max-w-full truncate break-all border-r-[1.5px] border-white/10 pr-5     opacity-100 ' tabIndex={-1}>
               <h1 className='font-bold text-white text-xl leading-tight min-w-0 select-text truncate text-heading-sm'>
                 {displayWallet ? (displayUsername ? displayUsername : shortenAddress(displayWallet)) : ' Wallet Disconnected 🔌'}
               </h1>
             </div>
     </div>
    </>
  )
}

export default Username