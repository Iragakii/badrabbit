import { useState } from 'react';
import { useAuth } from '../../../../../Auth/AuthContext';
import { normalizeImageUrl } from '../../../../config/api';
import { useWalletData } from '../../../../contexts/WalletContext';


const UserAvaWhenLog = () => {
  const { avatarUrl, address } = useAuth();
  const { totalUSD, totalETH, loading } = useWalletData();
  const normalizedAvatar = normalizeImageUrl(avatarUrl);
  const [isHovered, setIsHovered] = useState(false);

  // Format wallet address for display
  const formatAddress = (addr: string | null | undefined) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="w-full h-full cursor-pointer">
        <img
          src={normalizedAvatar || "/defaultava.png"}
          alt="Token Avatar"
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            // Fallback to default if image fails to load
            if (e.currentTarget.src !== "/defaultava.png") {
              e.currentTarget.src = "/defaultava.png";
            }
          }}
        />
      </button>
      
      {/* Dropdown on hover - with padding bridge to prevent gap */}
      {isHovered && (
        <>
          {/* Invisible bridge to prevent gap between trigger and dropdown */}
          <div 
            className="absolute right-0 top-full w-full h-2 pointer-events-auto"
            onMouseEnter={() => setIsHovered(true)}
          />
          <div 
            className="absolute right-0 top-full mt-2 bg-[#18230F] border border-gray-700 rounded-lg shadow-xl p-4 pb-5 min-w-[200px] z-[99999] pointer-events-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Wallet Address */}
            {address && (
              <div className="mb-3 pb-3 border-b border-gray-700">
                <div className="text-gray-400 text-xs mb-1">Wallet Address</div>
                <div className="text-white text-sm font-mono">{formatAddress(address)}</div>
              </div>
            )}
            
            {/* Balance Section - Show USD in dropdown */}
            <div>
              <div className="text-gray-400 text-xs mb-2">Balance</div>
              <div className="space-y-1">
                {loading ? (
                  <div className="text-gray-500 text-sm">Loading...</div>
                ) : (
                  <>
                    <div className="text-white font-semibold text-base">
                      {totalUSD !== null && totalUSD !== undefined ? `$${totalUSD.toFixed(2)}` : '$0.00'}
                    </div>
                    {totalETH !== null && (
                      <div className="text-gray-400 text-xs">
                        {totalETH.toFixed(4)} ETH
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            {/* Invisible buffer at bottom to prevent accidental mouse leave */}
            <div className="absolute bottom-0 left-0 right-0 h-2 pointer-events-auto" />
          </div>
        </>
      )}
    </div>
  );
};

export default UserAvaWhenLog;
