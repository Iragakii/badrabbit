import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";

interface ModalNFTChoiceProps {
  onClose: () => void;
  selectedCollection: {
    _id: string;
    name: string;
    image: string;
    chain: string;
    type: string;
  };
  onCreateNFT: () => void;
}

const ModalNFTChoice = ({ onClose, selectedCollection, onCreateNFT }: ModalNFTChoiceProps) => {
  const navigate = useNavigate();
  const { walletaddress } = useParams();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleViewNFTs = () => {
    onClose();
    // Navigate to items page with collection filter
    if (walletaddress) {
      navigate(`/${walletaddress}/items?collection=${selectedCollection._id}`);
    }
  };

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0C0C0C] bg-opacity-95 z-[2000]"
        onClick={onClose}
      >
        <div
          className="fixed inset-0 bg-[#0C0C0C] z-[2000] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#151516] border border-[#2C2C2C] rounded-[10px] p-8 max-w-md w-full mx-4">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white text-2xl z-[3000] cursor-pointer"
            >
              &times;
            </button>

            {/* Modal Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-white font-bold text-[40px] font-sans mb-2">
                  {selectedCollection.name}
                </h2>
                <p className="text-gray-400 text-[14px]">
                  What would you like to do with this collection?
                </p>
              </div>

              <div className="space-y-4">
                {/* Button 1: View Existing NFTs */}
                <button
                  onClick={handleViewNFTs}
                  className="w-full bg-[#8E3E63] hover:bg-[#7a3554] text-white font-[500] p-4 rounded-[7px] transition-colors duration-300 flex items-center justify-center gap-3"
                >
                  <span className="text-[18px]">View Existing NFTs</span>
                </button>

                {/* Button 2: Create NFT */}
                <button
                  onClick={() => {
                    onClose();
                    onCreateNFT();
                  }}
                  className="w-full bg-[#B6771D] hover:bg-[#9d6518] text-white font-[500] p-4 rounded-[7px] transition-colors duration-300 flex items-center justify-center gap-3"
                >
                  <span className="text-[18px]">Create NFT</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default ModalNFTChoice;

