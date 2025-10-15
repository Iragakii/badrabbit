import OptionSideSetting from "../../ProfileLayout/ProfileSettingUICPN/OptionSideSetting/OptionSideSetting";
import ButtonUploadImg from "./ButtonUploadImg";

const MainCreateCollec = () => {
  return (
    <>
      <div className="flex h-[85vh]">
        <div className="flex flex-col items-center justify-center bg-[#141415] w-230 space-y-2 border-r-1 border-[#181C14]">
          <div className="flex items-center gap-1">
            <span className=" text-xl bg-gradient-to-r from-[#59AC77] via-[#59AC77] to-[#FBF3D1] bg-clip-text text-transparent font-[600] font-sans z-1  shadow-2xl ">
              Collection Image
            </span>
            <img
              src="/createdui/alien.svg"
              alt=""
              className="w-12 h-12 cursor-pointer hover:scale-125 hover:rotate-12 hover:translate-y-[-12px] transition duration-300 rounded-full  transparent z-100"
            />
          </div>
       <div>
        <ButtonUploadImg></ButtonUploadImg>
       </div>

          <span className="text-white font-bold text-[17px] mt-3">
            Collection name
          </span>

          <div className="flex gap-2">
            <div className="bg-[#151517]/5  border-1 border-[#2a2b28] flex  items-center gap-1 px-1 rounded-[7px]">
              <img src="/eth-icon.svg" alt="" className="w-3 h-3" />
              <span className="text-white text-[12px]">ETHEREUM</span>
            </div>
            <div className="bg-[#151517]/5  border-1 border-[#2a2b28]   items-center  px-1 rounded-[7px]">
              <span className="text-white text-[12px]">ERC1155</span>
            </div>
          </div>
        </div>
        <div className="text-white flex flex-col items-start justify-center  px-10 w-300 space-y-2 border-r-1 border-[#181C14] ">
         <div className="mb-10 flex flex-col space-y-3">
           <span className="text-white font-bold text-[25px]">Start with your Collection Contract</span>
          <span className="text-gray-400 text-[15px]"> 
            Every NFT collection lives on its own smart contract. We'll deploy
            one for you now — it enables you to create NFTs.
          </span>
         </div>
        <div className="flex flex-col space-y-6 w-170 mb-5">
            <div className="flex flex-col space-y-2">
            <span className="font-bold text-[14px]">Name</span>
            <input type="text" name="" id="" placeholder="Add Contract Name" className="bg-[#141415] p-3 rounded-[8px] border-[#181C14] border-1"/>
            <span className="text-gray-400 text-[13px]">
              Your contract name is the same as your collection name. You won't
              be able to update later.
            </span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-bold text-[14px]">Tokem Symbol</span>
            <input
              type="text"
              name=""
              id=""
              placeholder="Add Collection Name"
              className="bg-[#141415] p-3 rounded-[8px] border-[#181C14] border-1 w-65"
            />
            <span className="text-gray-400 text-[13px]">Can't be changed after your contract is deployed.</span>
          </div>
        </div>
          <div className="space-y-2 flex flex-col">
            <span className="font-bold text-[14px]">Chain</span>
            <button  className="px-4 cursor-pointer bg-[#141415] p-3 rounded-[8px] border-[#181C14] border-1 flex justify-between w-90  items-center">
              {" "}
              <div className="flex gap-2 items-center">
                <div className="p-1 rounded-full bg-[#696FC7]">
                    <img src="/eth-icon.svg" alt="" className="w-4 h-4 " />
                </div>
              
                <span>Ethereum</span>
              </div>{" "}
              <img src="/public/createdui/arrow-down.svg" alt=""className="w-3 h-3" />
            </button>
            <span className="text-gray-400 text-[13px]">This is the blockchain your collection will live on.<br></br> You won't be able to switch it later.</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainCreateCollec;
