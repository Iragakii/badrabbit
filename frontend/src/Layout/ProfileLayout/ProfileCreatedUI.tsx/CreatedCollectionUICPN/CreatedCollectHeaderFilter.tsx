import React from "react";

const CreatedCollectHeaderFilter = () => {
  return (
    <>
      <div className="flex justify-between py-1  container mx-auto border-b-[0.2px] border-gray-800">
        <div className="flex gap-9">
          <div></div>
          <button className="p-2  text-gray-400 uppercase">Collections</button>
        </div>
        <div className="flex gap-9">
          <div className="flex p-2 m-auto items-center gap-1 text-gray-400  cursor-pointer hover:text-white">
            <button className=" text-[16px] uppercase">Floor Price</button>{" "}
            <img
              src="/createdui/double-arrow.svg"
              className="w-3 h-3"
              alt=""
            />
          </div>
             <div className="flex p-2 m-auto items-center gap-1 text-gray-400  cursor-pointer hover:text-white">
            <button className=" text-[16px] uppercase">Top Offer</button>{" "}
            <img
              src="/createdui/arrow-up.svg"
              className="w-3 h-3"
              alt=""
            />
          </div>
             <div className="flex p-2 m-auto items-center gap-1 text-gray-400  cursor-pointer hover:text-white">
            <button className=" text-[16px] uppercase">Vol</button>{" "}
            <img
              src="/createdui/double-arrow.svg"
              className="w-3 h-3"
              alt=""
            />
          </div>
             <div className="flex p-2 m-auto items-center gap-1 text-gray-400  cursor-pointer hover:text-white">
            <button className=" text-[16px] uppercase">Sales</button>{" "}
            <img
              src="/createdui/double-arrow.svg"
              className="w-3 h-3"
              alt=""
            />
          </div>
          <button className="p-2  text-gray-400  cursor-pointer hover:text-white text-[16px] uppercase">
            Owners
          </button>
          <button className="p-2  text-gray-400  cursor-pointer hover:text-white text-[16px] uppercase">
            Supply
          </button>
          <button className="p-2  text-gray-400 cursor-pointer hover:text-white text-[16px] uppercase">
            Last 7d
          </button>
        </div>
      </div>
    </>
  );
};

export default CreatedCollectHeaderFilter;
