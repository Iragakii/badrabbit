import  { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // Ethereum Mainnet

const WETHinWallet = () => {
  const [wethBalance, setWethBalance] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWETHBalance() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_accounts', []);
        if (accounts.length > 0) {
          const address = accounts[0];
          const contract = new ethers.Contract(WETH_ADDRESS, ERC20_ABI, provider);
          const rawBalance = await contract.balanceOf(address);
          const decimals = await contract.decimals();
          const formattedBalance = ethers.formatUnits(rawBalance, decimals);
          setWethBalance(formattedBalance);
        }
      }
    }
    fetchWETHBalance();
  }, []);

  return (
    <div>
      {wethBalance ? (
        <p>{parseFloat(wethBalance).toFixed(2)} WETH</p>
      ) : (
        <p>No Data</p>
      )}
    </div>
  );
};

export default WETHinWallet;
