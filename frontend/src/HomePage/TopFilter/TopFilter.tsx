import { useState } from "react";

interface TokenFilter {
  id: string;
  name: string;
  icon: string;
}

const TopFilter = () => {
  const [selectedToken, setSelectedToken] = useState<string>("all");

  const tokens: TokenFilter[] = [
    { id: "eth", name: "ETH", icon: "/eth-icon.svg" },
    { id: "pol", name: "POL", icon: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png" }, // Polygon icon from CoinGecko CDN
    { id: "sol", name: "SOL", icon: "https://assets.coingecko.com/coins/images/4128/small/solana.png" }, // Solana icon from CoinGecko CDN
  ];

  return (
    <div className="w-full py-4 px-6 border-b border-gray-800">
      <div className="flex justify-between items-center container mx-auto">
        {/* Left side - Filter button */}
        <div>
      
        </div>

        {/* Right side - Token filters */}
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setSelectedToken("all")}
            className={`px-4 py-2 rounded-[5px] border border-[#181C14] cursor-pointer transition duration-300 ${
              selectedToken === "all"
                ? "bg-[#3DB6B1] text-white border-[#3DB6B1]"
                : "bg-black text-gray-400 hover:text-white hover:scale-95"
            }`}
          >
            All
          </button>
          {tokens.map((token) => (
            <button
              key={token.id}
              onClick={() => setSelectedToken(token.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[5px] border border-[#181C14] cursor-pointer transition duration-300 ${
                selectedToken === token.id
                  ? "bg-[#3DB6B1] text-white border-[#3DB6B1]"
                  : "bg-black text-gray-400 hover:text-white hover:scale-95"
              }`}
            >
              <img
                src={token.icon}
                alt={token.name}
                className="w-4 h-4"
                onError={(e) => {
                  e.currentTarget.src = "/itemstemp/chain-i.svg";
                }}
              />
              <span className="text-sm font-medium">{token.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopFilter;

