import DynamicTokenPrice from "./MiddleCardCPN/DynamicTokenPrice"
import PercentPriceChangePerDay from "./MiddleCardCPN/PercentPriceChangePerDay"

import TokenName from "./MiddleCardCPN/TokenName"
import TokenTageName from "./MiddleCardCPN/TokenTageName"

interface MiddleCardDetailProps {
  name: string;
  symbol: string;
  currentPrice: number;
  change: number;
}

const MiddleCardDetail = ({ name, symbol, currentPrice, change }: MiddleCardDetailProps) => {
  return (
    <>
     <div>
        <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
                <TokenName name={name}></TokenName>
                <TokenTageName symbol={symbol}></TokenTageName>
            </div>
             <div className="flex items-center space-x-3 text-[14px]">
                <DynamicTokenPrice price={currentPrice}></DynamicTokenPrice>
                <PercentPriceChangePerDay change={change}></PercentPriceChangePerDay>
             </div>
        </div>
     </div>
    </>
  )
}

export default MiddleCardDetail
