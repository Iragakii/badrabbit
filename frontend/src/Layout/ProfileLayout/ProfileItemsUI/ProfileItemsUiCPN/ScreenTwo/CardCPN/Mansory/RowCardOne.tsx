import React from "react";

interface MediaCardProps {
  imageUrl: string;
  heightClass?: string;
  maxWidthClass?: string;
  chainIcon?: React.ReactNode;
  chainName?: string;
}

const RowCardOne: React.FC<MediaCardProps> = ({
  imageUrl,
  heightClass = "h-48",
  maxWidthClass = "max-w-full",
  chainIcon,
  chainName = "POL",
}) => {
  return (
    <div
      className={`relative rounded-xl overflow-hidden ${maxWidthClass} transform transition-all duration-300 ease-in-out hover:scale-[1.02] group`}
    >
      {/* Image */}
      <img
        src={imageUrl}
        alt="item"
        className={`w-full object-cover ${heightClass} cursor-pointer transition-transform duration-300 hover:scale-105`}
        loading="lazy"
      />

      {/* Top-left chain icon with 3D flip */}
      {chainIcon && (
        <div className="absolute top-2 left-2 w-10 h-9 perspective group cursor-pointer">
          <div className="relative w-full h-full transform-style-3d transition-transform duration-500 group-hover:rotate-y-180">
            {/* Front side (icon) */}
            <div className="absolute w-full h-full backface-hidden flex items-center justify-center rounded-full bg-black/60">
              {chainIcon}
            </div>
            {/* Back side (tooltip) */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center rounded-full bg-black/60 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-600">
              {chainName}
            </div>
          </div>
        </div>
      )}

      {/* Overlay content */}
      <div className="absolute bottom-0 left-0 w-full p-3 text-white bg-gradient-to-t from-black/70 to-transparent">
        <div className="text-sm font-semibold truncate bg-black/30 py-1 rounded flex items-center m-auto justify-center">
          Item Name
        </div>
        <div className="text-xs text-gray-300 truncate mt-1 bg-black/20 px-1 rounded flex items-center m-auto justify-center">
          Collection Name
        </div>

        {/* Listed + sliding button */}
        <div className="relative mt-1 h-6">
          {/* Listed text */}
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 bg-black/20 rounded">
            Listed
          </div>
          {/* Make Offer button (hidden by default) */}
          <button className="absolute inset-0 flex items-center justify-center bg-green-500 text-white text-xs font-semibold rounded transform translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            Make Offer
          </button>
        </div>
      </div>
    </div>
  );
};

export default RowCardOne;
