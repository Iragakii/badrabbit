import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../../../../../Auth/AuthContext";
import ModalListItem from "../../../../../../../Modal/ModalListItem/ModalListItem";

interface MediaCardProps {
  imageUrl: string;
  heightClass?: string;
  maxWidthClass?: string;
  chainIcon?: React.ReactNode;
  chainName?: string;
  itemName?: string;
  collectionName?: string;
  itemId?: string | number;
  contractAddress?: string;
  ownerWallet?: string;
  listed?: boolean;
  listPrice?: number;
}

const RowCardOne: React.FC<MediaCardProps> = ({
  imageUrl,
  heightClass = "h-48",
  maxWidthClass = "max-w-full",
  chainIcon,
  chainName = "POL",
  itemName = "Item Name",
  collectionName = "Collection Name",
  itemId,
  contractAddress,
  ownerWallet,
  listed = false,
  listPrice,
}) => {
  const navigate = useNavigate();
  const { walletaddress } = useParams<{ walletaddress?: string }>();
  const { address } = useAuth();
  const [showListItem, setShowListItem] = useState(false);
  
  // Check if logged-in user owns this NFT
  const normalizedAddress = address?.toLowerCase().trim();
  const normalizedOwnerWallet = ownerWallet?.toLowerCase().trim();
  const isOwner = normalizedAddress && normalizedOwnerWallet && 
    normalizedAddress === normalizedOwnerWallet;
  
  // Default to not listed if not specified
  const isListed = listed ?? false;

  const handleClick = () => {
    if (!itemId || !walletaddress) return;
    // Use contractAddress if provided, otherwise use a default placeholder
    const finalContractAddress = contractAddress || "0x0000000000000000000000000000000000000000";
    navigate(`/${walletaddress}/item/${itemId}/${finalContractAddress}`);
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden ${maxWidthClass} w-full transform transition-all duration-300 ease-in-out hover:scale-[1.02] group cursor-pointer`}
      onClick={handleClick}
    >
      {/* Image */}
      <img
        src={imageUrl}
        alt="item"
        className={`w-full object-cover ${heightClass} cursor-pointer transition-transform duration-300 hover:scale-105`}
        loading="lazy"
        onError={(e) => {
          console.error("Image failed to load:", imageUrl);
          // Optionally set a placeholder image
          (e.target as HTMLImageElement).src = "/placeholder-image.png";
        }}
      />

      {/* Top-left chain icon with 3D flip */}
      {chainIcon && (
        <div className="absolute top-2 left-2 w-10 h-9 perspective group cursor-pointer">
          <div className="relative w-full h-full transform-style-3d transition-transform duration-500 group-hover:rotate-y-180">
            {/* Front side (icon) */}
            <div className="absolute w-full h-full backface-hidden flex items-center justify-center rounded-full bg-black/60">
              {chainIcon}
            </div>
            {/* Back side (tooltip) */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center rounded-full bg-black/60 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-600">
              {chainName}
            </div>
          </div>
        </div>
      )}

      {/* Overlay content */}
      <div className="absolute bottom-0 left-0 w-full p-3 text-white bg-gradient-to-t from-black/70 to-transparent">
        <div className="text-sm font-semibold truncate bg-black/30 py-1 rounded flex items-center m-auto justify-center">
          {itemName}
        </div>
        <div className="text-xs text-gray-300 truncate mt-1 bg-black/20 px-1 rounded flex items-center m-auto justify-center">
          {collectionName}
        </div>

        {/* Status: Listed / Not Listed / Make Offer / List Item */}
        <div className="relative mt-1 h-6">
          {isOwner ? (
            // Owner view: Show "List Item" button if not listed, "Listed" if listed
            <>
              <div className="absolute inset-0 flex items-center justify-center gap-2 text-xs text-white bg-black/20 rounded">
                {isListed ? (
                  <>
                    <span>Listed</span>
                    {listPrice && listPrice > 0 && (
                      <span className="font-semibold">{listPrice.toFixed(4)} ETH</span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-400">Not Listed</span>
                )}
              </div>
              {!isListed && (
                <button 
                  className="absolute inset-0 flex items-center justify-center bg-green-500 text-white text-xs font-semibold rounded transform translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowListItem(true);
                  }}
                >
                  List Item
                </button>
              )}
            </>
          ) : (
            // Non-owner view: Show "Not Listed" by default, "Make Offer" on hover if listed
            <>
              <div className="absolute inset-0 flex items-center justify-center gap-2 text-xs text-white bg-black/20 rounded">
                {isListed ? (
                  <>
                    <span>Listed</span>
                    {listPrice && listPrice > 0 && (
                      <span className="font-semibold">{listPrice.toFixed(4)} ETH</span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-400">Not Listed</span>
                )}
              </div>
              {isListed && (
                <button 
                  className="absolute inset-0 flex items-center justify-center bg-green-500 text-white text-xs font-semibold rounded transform translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                >
                  Make Offer
                </button>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Modal List Item */}
      <ModalListItem
        isOpen={showListItem}
        onClose={() => setShowListItem(false)}
        item={{
          id: itemId?.toString(),
          _id: itemId?.toString(),
          name: itemName,
          imageUrl: imageUrl,
          collectionName: collectionName,
          ownerWallet: ownerWallet,
        }}
        onListed={() => {
          // Refresh page or update parent component
          window.location.reload();
        }}
      />
    </div>
  );
};

export default RowCardOne;
