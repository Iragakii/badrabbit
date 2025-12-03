import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { getApiUrl } from '../config/api';

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // Ethereum Mainnet

interface WalletContextType {
  totalUSD: number | null;
  totalETH: number | null;
  loading: boolean;
}

const WalletContext = createContext<WalletContextType>({
  totalUSD: null,
  totalETH: null,
  loading: true,
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [totalUSD, setTotalUSD] = useState<number | null>(null);
  const [totalETH, setTotalETH] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchWalletData = async () => {
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
            const totalETHFormatted = parseFloat(totalETHValue.toFixed(4));

            if (isMounted) {
              setTotalETH(totalETHFormatted);
              setTotalUSD(totalUSDValue);
              setLoading(false);
            }
          } else {
            if (isMounted) {
              setTotalUSD(null);
              setTotalETH(null);
              setLoading(false);
            }
          }
        } else {
          if (isMounted) {
            setTotalUSD(null);
            setTotalETH(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        if (isMounted) {
          setTotalUSD(null);
          setTotalETH(null);
          setLoading(false);
        }
      }
    };

    fetchWalletData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <WalletContext.Provider value={{ totalUSD, totalETH, loading }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletData = () => {
  return useContext(WalletContext);
};

