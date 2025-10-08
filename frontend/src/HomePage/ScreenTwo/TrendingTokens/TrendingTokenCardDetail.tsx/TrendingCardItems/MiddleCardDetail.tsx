import DynamicTokenPrice from "./MiddleCardCPN/DynamicTokenPrice"
import PercentPriceChangePerDay from "./MiddleCardCPN/PercentPriceChangePerDay"

import TokenName from "./MiddleCardCPN/TokenName"
import TokenTageName from "./MiddleCardCPN/TokenTageName"

const MiddleCardDetail = () => {
  return (
    <>
     <div>
        <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
                <TokenName></TokenName>
                <TokenTageName></TokenTageName>
            </div>
             <div className="flex items-center space-x-3 text-[14px]">
                <DynamicTokenPrice></DynamicTokenPrice>
                <PercentPriceChangePerDay></PercentPriceChangePerDay>
             </div>
        </div>
     </div>
    </>
  )
}

export default MiddleCardDetail