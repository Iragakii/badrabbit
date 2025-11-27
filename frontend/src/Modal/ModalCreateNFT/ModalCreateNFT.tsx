import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../Auth/AuthContext";
import { useParams } from "react-router-dom";
import ButtonUploadImg from "./ModalCreateNFTCPN/ButtonUploadImg";

interface ModalCreateNFTProps {
  onClose: () => void;
  selectedCollection?: {
    _id: string;
    name: string;
    image: string;
    chain: string;
    type: string;
  } | null;
}

interface Collection {
  _id: string;
  name: string;
  image: string;
  chain: string;
  type: string;
}

const ModalCreateNFT = ({ onClose, selectedCollection }: ModalCreateNFTProps) => {
  const { address } = useAuth();
  const { walletaddress } = useParams();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    collectionId: selectedCollection?._id || "",
    collectionName: selectedCollection?.name || "",
    supply: "",
    description: "",
    chainName: selectedCollection?.chain || "ETH",
    chainIcon: "/itemstemp/chain-i.svg",
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (!walletaddress) return;
    fetch(`http://localhost:8081/api/collections/owner/${walletaddress}`)
      .then((res) => res.json())
      .then((data) => {
        setCollections(data);
        if (selectedCollection && !formData.collectionId) {
          setFormData((prev) => ({
            ...prev,
            collectionId: selectedCollection._id,
            collectionName: selectedCollection.name,
            chainName: selectedCollection.chain,
          }));
        }
      })
      .catch((err) => console.error("Error fetching collections:", err));
  }, [walletaddress, selectedCollection]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "collectionId") {
      const collection = collections.find((c) => c._id === value);
      if (collection) {
        setFormData((prev) => ({
          ...prev,
          collectionName: collection.name,
          chainName: collection.chain,
        }));
      }
    }
  };

  const uploadToIPFS = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const uploadResponse = await fetch("http://localhost:8081/api/collections/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("Upload response:", errorText);
      throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    const uploadResult = await uploadResponse.json();
    console.log("Upload result:", uploadResult);
    return uploadResult.ipfsUrl;
  };

  const handleSubmit = async () => {
    if (!selectedFile || !formData.name || !formData.collectionId || !formData.supply) {
      alert("Please fill in all required fields and select an image");
      return;
    }

    if (!address) {
      alert("Please connect your wallet");
      return;
    }

    try {
      setLoading(true);

      // Upload image to IPFS
      const ipfsUrl = await uploadToIPFS(selectedFile);

      // Create NFT item
      const response = await fetch("http://localhost:8081/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerWallet: address,
          name: formData.name,
          collectionName: formData.collectionName,
          imageUrl: ipfsUrl,
          chainName: formData.chainName,
          chainIcon: formData.chainIcon,
          listed: true,
          supply: parseInt(formData.supply) || 1,
          description: formData.description,
        }),
      });

      if (response.ok) {
        alert("NFT created successfully!");
        onClose();
        // Optionally refresh the page or update state
        window.location.reload();
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        alert("Failed to create NFT");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating NFT: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
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
          className="fixed inset-0 z-[2000] flex items-center justify-center p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#0C0C0C] border border-[#2C2C2C] rounded-[10px] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white text-2xl z-[3000] cursor-pointer"
            >
              &times;
            </button>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              <h2 className="text-white font-bold text-[40px] font-sans">
                Create NFT
              </h2>

              <div className="space-y-4">
                {/* NFT Name */}
                <div className="flex flex-col space-y-2">
                  <label className="text-white font-semibold text-[14px]">
                    NFT Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter NFT name"
                    className="bg-[#141415] p-3 rounded-[8px] border border-[#181C14] text-white placeholder-gray-500"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                {/* Collection Selection */}
                <div className="flex flex-col space-y-2">
                  <label className="text-white font-semibold text-[14px]">
                    Choose Collection <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="bg-[#141415] p-3 rounded-[8px] border border-[#181C14] text-white"
                    value={formData.collectionId}
                    onChange={(e) => handleInputChange("collectionId", e.target.value)}
                  >
                    <option value="">Select a collection</option>
                    {collections.map((col) => (
                      <option key={col._id} value={col._id}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Supply */}
                <div className="flex flex-col space-y-2">
                  <label className="text-white font-semibold text-[14px]">
                    Supply <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter supply (e.g., 1, 100)"
                    min="1"
                    className="bg-[#141415] p-3 rounded-[8px] border border-[#181C14] text-white placeholder-gray-500"
                    value={formData.supply}
                    onChange={(e) => handleInputChange("supply", e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col space-y-2">
                  <label className="text-white font-semibold text-[14px]">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter NFT description (optional)"
                    rows={4}
                    className="bg-[#141415] p-3 rounded-[8px] border border-[#181C14] text-white placeholder-gray-500 resize-none"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

                {/* Image Upload */}
                <div className="flex flex-col space-y-2">
                  <label className="text-white font-semibold text-[14px]">
                    NFT Image <span className="text-red-500">*</span>
                  </label>
                  <ButtonUploadImg onFileSelect={setSelectedFile} />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  onClick={onClose}
                  className="bg-[#151517]/5 p-3 px-6 text-white font-[500] border border-[#2C2C2C] rounded-[7px] hover:bg-[#0C0C0C]/80 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-[#696FC7] p-3 px-6 text-white font-[500] rounded-[7px] hover:bg-[#5a5fb8] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create NFT"}
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

export default ModalCreateNFT;

