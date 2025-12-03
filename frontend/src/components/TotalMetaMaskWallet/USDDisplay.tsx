import { useWalletData } from '../../contexts/WalletContext';

const USDDisplay = () => {
  const { totalUSD, loading } = useWalletData();

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : totalUSD !== null && totalUSD !== undefined && !isNaN(totalUSD) ? (
        <p>${totalUSD.toFixed(2)}</p>
      ) : (
        <p>$0.00</p>
      )}
    </div>
  );
};

export default USDDisplay;

