import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getApiUrl } from '../config/api';

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // Ethereum Mainnet

export const useWalletUSD = () => {
  const [totalUSD, setTotalUSD] = useState<number | null>(null);
  const [totalETH, setTotalETH] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts

    const fetchTotalUSD = async () => {
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

            // Calculate total ETH (ETH + WETH)
            const totalETHValue = ethBalance + wethBalance;
            
            // Fetch ETH price from backend proxy
            const response = await fetch(getApiUrl('api/price/eth'));
            if (!response.ok) throw new Error('Failed to fetch price');
            const data = await response.json();
            const ethPrice = data.price;

            // Calculate total USD
            const total = totalETHValue * ethPrice;
            const totalUSDValue = parseFloat(total.toFixed(2));
            
            console.log('useWalletUSD - ETH:', ethBalance, 'WETH:', wethBalance, 'Total ETH:', totalETHValue, 'Price:', ethPrice, 'Total USD:', totalUSDValue);
            console.log('useWalletUSD - About to set state - isMounted:', isMounted, 'totalUSDValue:', totalUSDValue);
            
            // Only update state if component is still mounted
            if (isMounted) {
              setTotalETH(parseFloat(totalETHValue.toFixed(4)));
              setTotalUSD(totalUSDValue);
              setLoading(false);
              console.log('useWalletUSD - State updated - totalUSD:', totalUSDValue, 'totalETH:', parseFloat(totalETHValue.toFixed(4)));
            } else {
              console.log('useWalletUSD - Component unmounted, skipping state update');
            }
          } else {
            console.log('useWalletUSD - No accounts found');
            if (isMounted) {
              setTotalUSD(null);
              setTotalETH(null);
              setLoading(false);
            }
          }
        } else {
          console.log('useWalletUSD - No ethereum provider');
          if (isMounted) {
            setTotalUSD(null);
            setTotalETH(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching total USD:', error);
        if (isMounted) {
          setTotalUSD(null);
          setTotalETH(null);
          setLoading(false);
        }
      }
    };
    
    fetchTotalUSD();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  return { totalUSD, totalETH, loading };
};

