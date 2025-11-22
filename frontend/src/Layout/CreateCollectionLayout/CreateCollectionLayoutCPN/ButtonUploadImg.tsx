
import React, { useState, useRef } from 'react';

interface ButtonUploadImgProps {
  onFileSelect: (file: File | null) => void;
}

const ButtonUploadImg = ({ onFileSelect }: ButtonUploadImgProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      onFileSelect(file);
    } else {
      setImageSrc(null);
      onFileSelect(null);
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button
        className="w-[400px] h-[400px] border-dashed border-2 bg-[#19191a] rounded-[8px] border-[#2a2b28] flex flex-col items-center justify-center"
        onClick={() => inputRef.current?.click()}
      >
        {imageSrc ? (
         <div className='relative'>
           <img
            src={imageSrc}
            alt="Uploaded"
            className="w-full h-full object-cover rounded-[8px] cursor-pointer"
          />
            <div className=' absolute top-1 right-1 flex gap-2 p-2'>
               <button
                 className='cursor-pointer p-2 bg-[#0C0C0C] rounded-[8px] border-[#181C14] border-1'
                 onClick={(e) => {
                   e.stopPropagation();
                   setImageSrc(null);
                 }}
               >
                 <img src="/public/createdui/trash.svg" alt="" className='w-5 h-5' />
               </button>
               <button className='cursor-pointer p-2 bg-[#0C0C0C] rounded-[8px] border-[#181C14] border-1'><img src="/brush.svg" alt="" className='w-5 h-5' /></button>

            </div>
         </div>

        ) : (
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
        )}
      </button>
    </>
  );
};

export default ButtonUploadImg