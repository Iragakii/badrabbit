import { useAuth } from "../../../Auth/AuthContext";

const Username = () => {
      const { isLoggedIn, address , username } = useAuth();
      function shortenAddress(addr: string) {
        return addr.slice(0, 6);
      }
     
  return (
    <>
     <div>
         <div className='max-w-full truncate break-all border-r-[1.5px] border-white/10 pr-5     opacity-100 ' tabIndex={-1}>
               <h1 className='font-bold text-white text-xl leading-tight min-w-0 select-text truncate text-heading-sm'>
                 {isLoggedIn && address ? (username ? username : shortenAddress(address)) : ' Wallet Disconnected 🔌'}
               </h1>
             </div>
     </div>
    </>
  )
}

export default Username