import { useAuth } from "../../../../../../Auth/AuthContext";
import { getApiUrl } from "../../../../../config/api";
import { useNotification } from "../../../../../../components/Notification/NotificationContext";






const ButtonDisconectX = () => {
  const { address,  updateTwitter } = useAuth();
  const { showSuccess, showError, showWarning } = useNotification();

  const handleDisconnectX = async () => {
    if (!address) {
      showWarning('Please connect your wallet first');
      return;
    }

    try {
      // Call backend to disconnect X account
      const response = await fetch(getApiUrl(`api/x/disconnect?walletAddress=${encodeURIComponent(address)}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        showSuccess('X account disconnected successfully');
        // Immediately update the context to reflect disconnection
        updateTwitter(null);
      } else {
        const errorData = await response.json();
        showError(`Failed to disconnect X account: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error disconnecting X account:', error);
      showError('Error disconnecting X account');
    }
  };

  return (
   <>
      <div>
           <button
              type="button"
              onClick={handleDisconnectX}
              className="text-[16px] text-white border  border-gray-700 px-3 py-1 rounded-md hover:bg-[#181818] transition cursor-pointer"
            >
              - Disconnect
            </button>
     </div>
   </>
  )
}

export default ButtonDisconectX
