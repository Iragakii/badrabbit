import ETHinWallet from "../../../TotalMetaMaskWallet/ETHinWallet"
import WETHinWallet from "../../../TotalMetaMaskWallet/WETHinWallet"


const TotalETHvWETHinWalletCPN = () => {
  return (
    <>
         <div className="flex gap-3 text-[16px]">
              <ETHinWallet></ETHinWallet>
              <WETHinWallet></WETHinWallet>

         </div>
    </>

  )
}

export default TotalETHvWETHinWalletCPN