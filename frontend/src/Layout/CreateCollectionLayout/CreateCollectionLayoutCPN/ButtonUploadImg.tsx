
const ButtonUploadImg = () => {
  return (
    <>
       <button className="w-[400px] h-[400px] border-dashed border-2 bg-[#19191a] rounded-[8px] border-[#2a2b28] flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <button className="bg-[#151517]/5 p-2 hover:bg-[#0C0C0C]/80 group border-[#323024] border-1 rounded-[7px] cursor-pointer transation duration-300 ease-in-out">
                <img
                  src="/createdui/upload-i.svg"
                  alt=""
                  className="transation duration-300 ease-in-out w-4 h-4 group-hover:scale-120"
                />
              </button>
              <div className="flex space-x-2">
                <span className="text-[#FFFD8F] font-bold text-[13px] hover:text-[#E5C95F] cursor-pointer">
                  Click to upload
                </span>
                <span className="font-bold text-[13px] text-white">
                  or drag and drop
                </span>
              </div>
              <span className="text-gray-400">
                1000 x 1000 • GIF, JPG, PNG, SVG, max 50 MB{" "}
              </span>
            </div>
          </button>
    </>
  )
}

export default ButtonUploadImg