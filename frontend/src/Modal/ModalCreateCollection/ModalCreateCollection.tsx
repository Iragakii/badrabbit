import Card from "@mui/material/Card";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import CardDropNFT from "./ModalCreateCollectionCPN/CardDropNFT";
import CardCreateCollecNFT from "./ModalCreateCollectionCPN/CardCreateCollecNFT";

interface ModalCreateCollectionProps {
  onClose: () => void;
}

const ModalCreateCollection = ({ onClose }: ModalCreateCollectionProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0C0C0C] 0 z-[2000]"
        onClick={onClose}
      >
        <div
          className="fixed inset-0 bg-[#0C0C0C]  z-[2000] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            {" "}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-[3000] cursor-pointer"
            >
              &times;
            </button>
          </div>
          <div className="flex  overflow-auto">
            <div className=" w-120 h-screen flex flex-col items-center justify-center space-y-8">
              <div className="text-white font-bold text-[55px] font-sans">
                What do you<br></br> want to create?
              </div>
              <div className="flex space-x-9 bg-[#151516] border-[#2C2C2C] border-1 rounded-[10px] p-4 ">
                <span className="text-gray-400 text-[13px] font-sans font-[500]">
                  View our guide to help decide between a <br></br>Scheduled
                  Drop and an Instant Collection
                </span>
                <button className="text-white font-[700] text-[14px] border-[#2C2C2C] border-1 bg-[#191919] hover:bg-[#191919]/10 cursor-pointer p-3 py-0 font-sans rounded-[10px]">
                  View Guide
                </button>
              </div>
            </div>
      
              <div className=" w-130 h-screen flex flex-col items-center justify-center">
              <CardDropNFT></CardDropNFT>
            </div>
            <div className=" w-130 h-screen  flex flex-col items-center justify-center">  <CardCreateCollecNFT></CardCreateCollecNFT></div>
       
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default ModalCreateCollection;
