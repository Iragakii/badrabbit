import React from "react";
import { Link } from "react-router-dom";

const FooterCreateColle = () => {
  return (
    <>
      <div className="flex items-center justify-end px-10 space-x-5 border-t-1 border-[#181C14] py-4">
        <Link to="" className="">
          <button className="bg-[#0C0C0C]/30 p-3 py-2 text-white font-[600] border-1 rounded-[8px] border-[#181C14] hover:bg-[#0C0C0C]/80 cursor-pointer">Cancel</button>
        </Link>
        <button className="text-white font-[600] bg-blue-500 hover:bg-blue-400 transition duration-300 p-3 py-2 rounded-[8px] cursor-pointer">Publish Contract</button>
      </div>
    </>
  );
};

export default FooterCreateColle;
