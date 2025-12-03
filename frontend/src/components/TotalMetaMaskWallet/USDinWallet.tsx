import { useWalletData } from '../../contexts/WalletContext';

const USDinWallet = () => {
  const { totalETH, loading } = useWalletData();

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : totalETH !== null && totalETH !== undefined ? (
        <p>{totalETH.toFixed(4)} ETH</p>
      ) : (
        <p>0.00 ETH</p>
      )}
    </div>
  );
};

export default USDinWallet;

