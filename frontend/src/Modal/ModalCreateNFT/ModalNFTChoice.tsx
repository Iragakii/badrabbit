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
    if (walletaddress && selectedCollection?._id) {
      console.log("Navigating with collection ID:", selectedCollection._id);
      navigate(`/${walletaddress}/items?collection=${selectedCollection._id}`);
    } else {
      console.error("Missing walletaddress or collection ID:", { walletaddress, collectionId: selectedCollection?._id });
      if (walletaddress) {
        navigate(`/${walletaddress}/items`);
      }
    }
  };

  const modalContent = (
    <>
      {/* Full Screen Backdrop with Black Opacity */}
      <div
        className="fixed inset-0 bg-black bg-opacity-80 z-[2000]"
        onClick={onClose}
      >
        <div
          className="fixed inset-0 z-[2000] flex flex-col p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 text-white hover:text-gray-300 text-3xl z-[3000] cursor-pointer"
          >
            &times;
          </button>

          {/* Full Screen Modal Content */}
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <div className="space-y-8 w-full max-w-2xl">
              <div className="flex flex-col items-center justify-center text-center">
              <img src="/itemstemp/create-nft-gif.gif" alt="" className="w-60 h-60 object-cover flex justify-center items-center " />
                <h2 className="text-white font-bold text-[55px] font-sans mb-4">
                  {selectedCollection.name}
                </h2>
                <p className="text-gray-400 text-[18px]">
                  What would you like to do with this collection?
                </p>
              </div>

              <div className="space-y-6">
                {/* Button 1: View Existing NFTs */}
                <button
                  onClick={handleViewNFTs}
                  className="w-full bg-[#8E3E63] hover:bg-[#7a3554] text-white font-[500] p-6 rounded-[10px] transition-colors duration-300 flex items-center justify-center gap-3 text-[20px] cursor-pointer"
                >
                  <span>View Existing NFTs</span>
                </button>

                {/* Button 2: Create NFT */}
                <button
                  onClick={onCreateNFT}
                  className="w-full bg-[#B6771D] hover:bg-[#9d6518] text-white font-[500] p-6 rounded-[10px] transition-colors duration-300 flex items-center justify-center gap-3 text-[20px] cursor-pointer"
                >
                  <span>Create NFT</span>
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

