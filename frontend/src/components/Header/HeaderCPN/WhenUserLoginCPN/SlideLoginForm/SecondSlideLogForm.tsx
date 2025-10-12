import { useEffect, useState } from "react";
import MetaMaskAvatar from "../../../../MetaMaskAvatar/MetaMaskAvatar";
import UserAvaWhenLog from "../UserAvaWhenLog";
import { ethers } from "ethers";
import PrimaryWalletIcon from "../../../../PrimaryWallet/PrimaryWalletIcon";

import USDinWallet from "../../../../TotalMetaMaskWallet/USDinWallet";

const SecondSlideLogForm = () => {
  const [address, setAddress] = useState<string | null>(null);

function shortenAddress(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

useEffect(() => {
  async function checkConnection() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_accounts", []);
      if (accounts.length > 0) {
        setAddress(accounts[0]);
      }
    }
  }
  checkConnection();
}, []);

  return (
    <>
      <div className=" h-12 w-auto py-2 flex justify-between gap-3  ">
        <div>
          <UserAvaWhenLog></UserAvaWhenLog>

          <div className="relative bottom-[18px] right-[-18px]">
            <MetaMaskAvatar></MetaMaskAvatar>
          </div>
        </div>
        <div className="">
          <div className="flex gap-[7px]">
          {" "}
          <div className="flex min-w-0 items-center gap-2">
            <div className="max-w-full truncate break-all" tabIndex={-1}>
              <h1 className="font-medium leading-tight min-w-0 select-text truncate text-heading-sm">
                {address ? shortenAddress(address) : " Wallet Disconnected 🔌"}
              </h1>
            </div>
          </div>
          <div><PrimaryWalletIcon></PrimaryWalletIcon> </div>
        </div>
          <div>
            <USDinWallet></USDinWallet>
          </div>
        </div>
        <div>
           <img src="/check.svg" alt="" className="w-4 h-4 mt-2" />
        </div>
      </div>
    </>
  );
};

export default SecondSlideLogForm;
