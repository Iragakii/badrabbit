

interface TokenNameProps {
  name: string;
}

function TokenName({ name }: TokenNameProps) {
  return (
    <>
     <div className="w-14 truncate text-white font-medium">
        <span className="text-[17px]">{name}</span>
     </div>
    </>
  )
}

export default TokenName
