

interface TokenTageNameProps {
  symbol: string;
}

const TokenTageName = ({ symbol }: TokenTageNameProps) => {
  return (
    <>
     <div className="max-w-full truncate break-all shrink-0 text-[#8EA3A6] font-[700]">
        <span className="">{symbol.toUpperCase()}</span>
     </div>
    </>
  )
}

export default TokenTageName
