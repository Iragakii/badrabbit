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
}

const EachTrendingCardCPN = ({ token, chartData, currentPrice, change }: EachTrendingCardCPNProps) => {
  return (
    <>
   
       <div className="">
        <Link href={token.cmcLink} target="_blank" underline="none">
              <div className="w-xs cursor-pointer">
          <div className="bg-[#212121] p-2 pl-2 pr-2 rounded-lg m-2">
            <div className="flex items-center pl-4 pr-4 justify-between">
              <div className="flex">
                <TokenAvatar></TokenAvatar>
                <div className="relative top-[25px] left-[-10px]">
                  <ChainAvatar></ChainAvatar>
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
