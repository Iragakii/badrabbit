import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // Ethereum Mainnet

const USDinWallet = () => {
  const [totalUSD, setTotalUSD] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTotalUSD() {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send('eth_accounts', []);
          if (accounts.length > 0) {
            const address = accounts[0];

            // Fetch ETH balance
            const ethBalanceWei = await provider.getBalance(address);
            const ethBalance = parseFloat(ethers.formatEther(ethBalanceWei));

            // Fetch WETH balance
            const contract = new ethers.Contract(WETH_ADDRESS, ERC20_ABI, provider);
            const wethBalanceWei = await contract.balanceOf(address);
            const decimals = await contract.decimals();
            const wethBalance = parseFloat(ethers.formatUnits(wethBalanceWei, decimals));

            // Fetch ETH price from backend proxy
          const response = await fetch('/api/price/eth');
if (!response.ok) throw new Error('Failed to fetch price');
const data = await response.json();
const ethPrice = data.price; // ✅ extract number field

            // Calculate total USD
            const total = (ethBalance + wethBalance) * ethPrice;
            setTotalUSD(total.toFixed(2));
          }
        }
      } catch (error) {
        console.error('Error fetching total USD:', error);
        setTotalUSD('Error');
      }
    }
    fetchTotalUSD();
  }, []);

  return (
    <div>
      {totalUSD === 'Error' ? (
        <p>Error</p>
      ) : totalUSD ? (
        <p>${totalUSD}</p>
      ) : (
        <p>No Data</p>
      )}
    </div>
  );
};

export default USDinWallet;
