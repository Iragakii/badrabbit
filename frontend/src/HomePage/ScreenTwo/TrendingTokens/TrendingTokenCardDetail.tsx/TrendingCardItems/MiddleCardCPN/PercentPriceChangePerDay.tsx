

interface PercentPriceChangePerDayProps {
  change: number;
}

const PercentPriceChangePerDay = ({ change }: PercentPriceChangePerDayProps) => {
  const isPositive = change >= 0;
  return (
    <>
      <div>
        <span className={`font-mono cursor-pointer ${isPositive ? 'text-[#78C841]' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)}%
        </span>
      </div>
    </>
  )
}

export default PercentPriceChangePerDay
