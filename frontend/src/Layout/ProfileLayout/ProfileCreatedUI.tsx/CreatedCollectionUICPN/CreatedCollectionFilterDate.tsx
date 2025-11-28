import BTNCreatedCollectNavBar from "./BTNCreatedCollectNavBar";

const CreatedCollectHeaderFilterDate = () => {
  return (
    <>
      <div className="flex justify-between container mx-auto ">
        <div>
          <button className="p-2 bg-black rounded-[5px] border-1 border-[#181C14] cursor-pointer group hover:scale-95 transition duration-300">
            <img
              src="/public/createdui/filter.svg"
              alt=""
              className="w-4 h-4 hover:scale-135 transition duration-300"
            />
          </button>
        </div>
        <div className="flex gap-5">
          <div className="border-r-1 pr-5 border-gray-800 flex gap-3">
            <span className="p-2 bg-black items-center m-auto rounded-[5px] border-1 border-[#181C14] cursor-pointer group hover:scale-95 transition duration-300 text-white">
              All
            </span>
            <button className="p-2  text-gray-400  cursor-pointer hover:text-white text-[16px]">
              30d
            </button>
            <button className="p-2  text-gray-400 cursor-pointer hover:text-white text-[16px]">
              7d
            </button>
            <button className="p-2  text-gray-400  cursor-pointer hover:text-white text-[16px]">
              1d
            </button>
            <button className="p-2  text-gray-400 cursor-pointer hover:text-white text-[16px]">
              1h
            </button>
            <button className="p-2  text-gray-400  cursor-pointer hover:text-white text-[16px]">
              15m
            </button>
            <button className="p-2  text-gray-400  cursor-pointer hover:text-white text-[16px]">
              5m
            </button>
            <button className="p-2  text-gray-400 cursor-pointer hover:text-white text-[16px]">
              1m
            </button>
          </div>
          <button className="p-2 items-center m-auto bg-black rounded-[5px] border-1 border-[#181C14] cursor-pointer group hover:scale-95 transition duration-300">
            <img
              src="/public/createdui/resize-table.svg"
              alt=""
              className="w-4 h-4 hover:scale-135 transition duration-300"
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default CreatedCollectHeaderFilterDate;
