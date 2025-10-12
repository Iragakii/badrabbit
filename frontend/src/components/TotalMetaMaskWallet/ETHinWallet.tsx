import  { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ETHinWallet = () => {
  const [ethBalance, setEthBalance] = useState<string | null>(null);

  useEffect(() => {
    async function fetchETHBalance() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_accounts', []);
        if (accounts.length > 0) {
          const address = accounts[0];
          const balance = await provider.getBalance(address);
          const formattedBalance = ethers.formatEther(balance);
          setEthBalance(formattedBalance);
        }
      }
    }
    fetchETHBalance();
  }, []);

  return (
    <div>
      {ethBalance ? (
        <p>{parseFloat(ethBalance).toFixed(2)} ETH</p>
      ) : (
        <p>No Data</p>
      )}
    </div>
  );
};

export default ETHinWallet;
