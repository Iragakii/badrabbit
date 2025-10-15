const HeaderCreateColle = () => {
  return (
    <>
      <div>
        <header className=" bg-[#0C0C0C] text-white py-2 px-5 z-50 border-b border-[#181C14]">
          <div className=" flex container  gap-5 items-center">
            <div className="pr-5 border-r-1 border-[#2C2C2C]    ">
              <button className="bg-[#151516] border-[#2C2C2C] border-1 rounded-[7px] p-2 cursor-pointer hover:bg-[#151516]/30">
                <img src="/public/createdui/back-arrow.svg" alt="" className="w-3 h-3" />
              </button>
            </div>
            <div className="text-gray-400">Create Collection</div>
            <div className="text-gray-300"> {">"} </div>
            <div className="font-bold text-[14px] text-white">Deploy smart contract</div>
          </div>
        </header>
      </div>
    </>
  );
};

export default HeaderCreateColle;
