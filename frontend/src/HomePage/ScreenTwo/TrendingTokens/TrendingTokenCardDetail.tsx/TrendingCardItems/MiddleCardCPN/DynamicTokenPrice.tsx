interface DynamicTokenPriceProps {
  price: number;
}

const DynamicTokenPrice = ({ price }: DynamicTokenPriceProps) => {
  return (
    <>
      <div>
        <div className="flex items-center  text-[#acadae]">
          <span>$</span>
          <div className="w-[39px] break-all shrink-0 overflow-hidden whitespace-nowrap text-clip  ">
            {" "}
            <span>{price.toFixed(6)}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DynamicTokenPrice;
