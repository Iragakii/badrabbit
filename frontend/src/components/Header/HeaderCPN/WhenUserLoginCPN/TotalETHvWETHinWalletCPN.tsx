import ETHinWallet from "../../../TotalMetaMaskWallet/ETHinWallet"
import WETHinWallet from "../../../TotalMetaMaskWallet/WETHinWallet"


const TotalETHvWETHinWalletCPN = () => {
  return (
    <>
         <div className="flex gap-3 text-[16px]">
              <div className="flex gap-2 border-r pr-3 border-[#181C14]">
                <img src="/eth-icon.svg" alt="" className="w-4 h-4 mt-[3px]"/>
                <ETHinWallet></ETHinWallet>
              </div>
              <WETHinWallet></WETHinWallet>

         </div>
    </>

  )
}

export default TotalETHvWETHinWalletCPN