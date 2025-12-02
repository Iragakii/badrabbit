import { useNavigate } from "react-router-dom";
import { normalizeImageUrl } from "../../config/api";

interface CollectionCardProps {
  collection: {
    id?: string;
    _id?: string;
    name: string;
    image: string;
    chain: string;
    ownerWallet: string;
  };
  price?: number;
  percentChange?: number;
}

const CollectionCard = ({ collection, price, percentChange }: CollectionCardProps) => {
  const navigate = useNavigate();
  const collectionId = collection.id || collection._id || "";
  const imageUrl = normalizeImageUrl(collection.image) || "/defaultava.png";
  
  // Determine chain icon
  const chainIcon = collection.chain === "Ethereum" 
    ? "/eth-icon.svg" 
    : collection.chain === "Polygon"
    ? "/itemstemp/chain-i.svg"
    : "/itemstemp/chain-i.svg";
  
  const chainName = collection.chain === "Ethereum" 
    ? "ETH" 
    : collection.chain === "Polygon"
    ? "POL"
    : collection.chain || "ETH";

  const handleClick = () => {
    if (collectionId && collection.ownerWallet) {
      navigate(`/${collection.ownerWallet}/items?collection=${collectionId}`);
    }
  };

  return (
    <div
      className="relative rounded-xl overflow-hidden w-full transform transition-all duration-300 ease-in-out hover:scale-[1.02] group cursor-pointer"
      onClick={handleClick}
    >
      {/* Collection Card - Match ScreenTwo design */}
      <div className="bg-[#212121] p-2 pl-2 pr-2 rounded-lg m-2">
        <div className="flex items-center pl-4 pr-4 justify-between">
          {/* Left side - Avatar with chain badge */}
          <div className="flex items-center">
            <div className="relative">
              <img
                src={imageUrl}
                alt={collection.name}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  if (e.currentTarget.src !== "/defaultava.png") {
                    e.currentTarget.src = "/defaultava.png";
                  }
                }}
              />
              {/* Chain badge - positioned like ScreenTwo */}
              <div className="absolute top-[25px] left-[-10px] w-6 h-6 rounded-full bg-black/70 flex items-center justify-center border border-gray-700/50">
                <img
                  src={chainIcon}
                  alt={chainName}
                  className="w-4 h-4"
                  onError={(e) => {
                    e.currentTarget.src = "/itemstemp/chain-i.svg";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Middle - Collection Name, Price, and Percentage */}
          <div className="flex flex-col items-end">
            <div className="text-white font-medium text-sm mb-1 truncate max-w-[80px]">
              {collection.name.length > 8 ? `${collection.name.substring(0, 8)}...` : collection.name}
            </div>
            <div className="flex items-center gap-2">
              {price !== undefined ? (
                <span className="text-[#acadae] text-xs font-mono">
                  {price.toFixed(4)} {chainName}
                </span>
              ) : (
                <span className="text-gray-500 text-xs">N/A</span>
              )}
              {percentChange !== undefined && (
                <span
                  className={`font-mono text-xs ${
                    percentChange >= 0 ? "text-[#78C841]" : "text-red-500"
                  }`}
                >
                  {percentChange >= 0 ? "+" : ""}
                  {percentChange.toFixed(2)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;

