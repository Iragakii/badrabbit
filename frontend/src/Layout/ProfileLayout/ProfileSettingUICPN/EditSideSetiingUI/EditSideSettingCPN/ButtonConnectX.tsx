import { useAuth } from "../../../../../../Auth/AuthContext";




const ButtonConnectX = () => {
  const { address } = useAuth();

  const handleConnectX = () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }
    // Redirect to backend login endpoint which sends user to X
    window.location.href = `http://localhost:8081/api/x/login?walletAddress=${encodeURIComponent(address)}`;
  };

  return (
    <>
     <div>
           <button
              type="button"
              onClick={handleConnectX}
              className="text-[16px] text-white border  border-gray-700 px-3 py-1 rounded-md hover:bg-[#181818] transition cursor-pointer"
            >
              + Connect
            </button>
     </div>
    </>
  )
}

export default ButtonConnectX