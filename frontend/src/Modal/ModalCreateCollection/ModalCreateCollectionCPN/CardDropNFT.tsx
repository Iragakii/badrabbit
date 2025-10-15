

const CardDropNFT = () => {
  return (
    <>
       <div className="flex flex-col space-y-4 font-sans group hover:bg-[#8E3E63] p-7 rounded-[6px] cursor-pointer transition-all duration-300  ease-in-out">
                <img src="/public/createdui/rainbow.jpg" alt="" className="w-30 h-30 rounded-[10px]"/>
                <span className="text-white font-[650] text-[30px]">Scheduled Drop</span>
                <button className="cursor-pointer group-hover:border-0 p-3 py-[7px] font-[500] group-hover:bg-[#FDAAAA] bg-[#151516] border-1 border-[#2C2C2C] text-white rounded-[7px]">Create Drop</button>
                <span className="text-gray-400">Build anticipation with timed launches, gated <br></br> access,and reveal after mint. Great for 1/1 or<br></br> curated editions.</span>
                <div
                  className="flex items-center gap-2"
                >
                  <img src="/public/settingprofile/dev-tag.svg" alt="" className="w-4 h-4" />
                  <span className="text-white text-[14px]">ERC-721 contract</span>
                </div>
                   <div
                  className="flex items-center gap-2"
                >
                  <img src="/public/settingprofile/dev-tag.svg" alt="" className="w-4 h-4" />
                  <span className="text-white text-[14px]">Scheduled launch</span>
                </div>
                   <div
                  className="flex items-center gap-2"
                >
                  <img src="/public/settingprofile/dev-tag.svg" alt="" className="w-4 h-4" />
                  <span className="text-white text-[14px]">Fixed number of items - set how many will ever <br></br> be available</span>
                </div>
                   <div
                  className="flex items-center gap-2"
                >
                  <img src="/public/settingprofile/dev-tag.svg" alt="" className="w-4 h-4" />
                  <span className="text-white text-[14px]">Post-mint reveal</span>
                </div>
                   <div
                  className="flex items-center gap-2"
                >
                  <img src="/public/settingprofile/dev-tag.svg" alt="" className="w-4 h-4" />
                  <span className="text-white text-[14px]">Gated access</span>
                </div>
              </div></>
  )
}

export default CardDropNFT