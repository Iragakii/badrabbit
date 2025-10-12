import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import UserAvaWhenLog from "../UserAvaWhenLog"
import CountWallet from "./CountWallet"

const TopSlideLogForm = () => {
  const [address, setAddress] = useState<string | null>(null);

  function shortenAddress(addr: string) {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  }

  useEffect(() => {
    async function checkConnection() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_accounts', []);
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        }
      }
    }
    checkConnection();
  }, []);

  return (
    <>
      <div className="flex gap-3 border-b-1 border-[#181C14] py-3 px-3  rounded-md bg-[#509488] hover:bg-[#202E24]">
         <div>
            <UserAvaWhenLog></UserAvaWhenLog>
         </div>
       <div className=" space-y-1">
           <div className="flex min-w-0 items-center gap-2">
             <div className='max-w-full truncate break-all' tabIndex={-1}>
               <h1 className='font-medium leading-tight min-w-0 select-text truncate text-heading-sm'>
                 {address ? shortenAddress(address) : ' Wallet Disconnected 🔌'}
               </h1>
             </div>
           </div>
         <CountWallet></CountWallet>
      </div>
      </div>
    </>
  )
}

export default TopSlideLogForm