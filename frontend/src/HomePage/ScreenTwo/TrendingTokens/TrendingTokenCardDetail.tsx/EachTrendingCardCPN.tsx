import Link from "@mui/material/Link";
import ChainAvatar from "./TrendingCardItems/ChainAvatar";
import MiddleCardDetail from "./TrendingCardItems/MiddleCardDetail";
import MiniSparklingChart from "./TrendingCardItems/MiniSparklingChart";
import TokenAvatar from "../../../../components/TokenAvatar/TokenAvatar";


interface EachTrendingCardCPNProps {
  token: {
    id: string;
    name: string;
    symbol: string;
    cmcLink: string;
  };
  chartData: number[];
  currentPrice: number;
  change: number;
  image?: string;
}

const EachTrendingCardCPN = ({ token, chartData, currentPrice, change, image }: EachTrendingCardCPNProps) => {
  return (
    <>
       <div className="w-full">
        <Link href={token.cmcLink} target="_blank" underline="none">
          <div className="w-full cursor-pointer group">
            <div className="bg-[#212121] p-2 pl-2 pr-2 rounded-lg transform transition-all duration-300 ease-in-out hover:scale-[1.02]">
              <div className="flex items-center pl-4 pr-4 justify-between">
                <div className="flex">
                  {/* Token Avatar - Dynamic from API */}
                  <div className="relative">
                    <img
                      src={image || "/defaultava.png"}
                      alt={token.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        if (e.currentTarget.src !== "/defaultava.png") {
                          e.currentTarget.src = "/defaultava.png";
                        }
                      }}
                    />
                    {/* Chain badge - Use ETH icon like ScreenOne */}
                    <div className="absolute top-[25px] left-[-10px] w-6 h-6 rounded-full bg-black/70 flex items-center justify-center border border-gray-700/50">
                      <img
                        src="/eth-icon.svg"
                        alt="ETH"
                        className="w-4 h-4"
                        onError={(e) => {
                          e.currentTarget.src = "/itemstemp/chain-i.svg";
                        }}
                      />
                    </div>
                  </div>
                </div>
                <MiddleCardDetail name={token.name} symbol={token.symbol} currentPrice={currentPrice} change={change}></MiddleCardDetail>
                <div className="w-17">
                  <MiniSparklingChart data={chartData}></MiniSparklingChart>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default EachTrendingCardCPN;
