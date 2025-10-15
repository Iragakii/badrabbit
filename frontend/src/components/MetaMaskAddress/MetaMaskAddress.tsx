import { useAuth } from "../../../Auth/AuthContext";


const MetaMaskAddress = () => {

  const { isLoggedIn, address , username } = useAuth();

  function shortenAddress(addr: string) {
    return addr.slice(0, 6) ;
  }


  return (
    <>
      <div className="flex min-w-0 items-center gap-2">
        <div className='max-w-full truncate break-all' tabIndex={-1}>
          <h1 className='!no-underline text-white font-medium leading-tight min-w-0 select-text truncate text-heading-sm'>
             {isLoggedIn && address ? (username ? username : shortenAddress(address)) : ' Wallet Disconnected 🔌'}
          </h1>
        </div>
      </div>
    </>
  );
};

export default MetaMaskAddress;
