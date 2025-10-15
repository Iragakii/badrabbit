import { Link } from "react-router-dom";

const CardCreateCollecNFT = () => {
  return (
    <>
      <div className="flex flex-col space-y-4 font-sans group hover:bg-[#B6771D] p-7 rounded-[6px] cursor-pointer transition-all duration-300  ">
        <img
          src="/public/createdui/addcollection.jpg"
          alt=""
          className="w-30 h-30 rounded-[10px]"
        />
        <span className="text-white font-[650] text-[30px]">
          Open Collection
        </span>
      <Link to="/studio/create/collection" className="cursor-pointer group-hover:border-0 p-15 py-[7px] font-[500] group-hover:bg-[#FFE100] group-hover:text-black bg-[#151516] border-1 border-[#2C2C2C] text-white rounded-[7px] flex items-center justify-center">  <button className="">
          Create Collection
        </button></Link>
        <span className="text-gray-400">
          Publish immediately, ideal for ongoing series or <br></br>iterative
          work. Best for Editions or mixed-format <br></br> collections.
        </span>
        <div className="flex items-center gap-2">
          <img
            src="/public/settingprofile/dev-tag.svg"
            alt=""
            className="w-4 h-4"
          />
          <span className="text-white text-[14px]">ERC-1155 contract</span>
        </div>
        <div className="flex items-center gap-2">
          <img
            src="/public/settingprofile/dev-tag.svg"
            alt=""
            className="w-4 h-4"
          />
          <span className="text-white text-[14px]">Launch Instantly</span>
        </div>
        <div className="flex items-center gap-2">
          <img
            src="/public/settingprofile/dev-tag.svg"
            alt=""
            className="w-4 h-4"
          />
          <span className="text-white text-[14px]">
            Add new items anytime - no fixed supply,<br></br> supports ongoing
            creativity
          </span>
        </div>
        <div className="flex items-center gap-2">
          <img
            src="/public/settingprofile/dev-tag.svg"
            alt=""
            className="w-4 h-4"
          />
          <span className="text-white text-[14px]">Items show right away</span>
        </div>
        <div className="flex items-center gap-2">
          <img
            src="/public/settingprofile/dev-tag.svg"
            alt=""
            className="w-4 h-4"
          />
          <span className="text-white text-[14px]">
            Great for evolving collections
          </span>
        </div>
      </div>
    </>
  );
};

export default CardCreateCollecNFT;
