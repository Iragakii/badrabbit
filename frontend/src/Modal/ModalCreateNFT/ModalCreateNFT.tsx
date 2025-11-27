import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../Auth/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import ButtonUploadImg from "./ModalCreateNFTCPN/ButtonUploadImg";

interface ModalCreateNFTProps {
  onClose: () => void;
  selectedCollection?: {
    _id?: string;
    id?: string;
    name: string;
    image: string;
    chain: string;
    type: string;
  } | null;
}

interface Collection {
  _id?: string;
  id?: string;
  name: string;
  image: string;
  chain: string;
  type: string;
}

const ModalCreateNFT = ({ onClose, selectedCollection }: ModalCreateNFTProps) => {
  const { address } = useAuth();
  const { walletaddress } = useParams();
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    collectionId: (selectedCollection?._id || selectedCollection?.id) || "",
    collectionName: selectedCollection?.name || "",
    supply: "",
    description: "",
    chainName: selectedCollection?.chain === "Ethereum" ? "ETH" : (selectedCollection?.chain || "ETH"),
    chainIcon: selectedCollection?.chain === "Ethereum" ? "/eth-icon.svg" : "/itemstemp/chain-i.svg",
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
        console.log("Fetched collections for NFT creation:", data);
        setCollections(data);
        if (selectedCollection && !formData.collectionId) {
          // Get the collection ID (handle both id and _id)
          const collectionId = selectedCollection._id || selectedCollection.id || "";
          const chainIcon = selectedCollection.chain === "Ethereum" ? "/eth-icon.svg" : "/itemstemp/chain-i.svg";
          console.log("Setting initial collection:", selectedCollection.name, "ID:", collectionId);
          setFormData((prev) => ({
            ...prev,
            collectionId: collectionId,
            collectionName: selectedCollection.name,
            chainName: selectedCollection.chain === "Ethereum" ? "ETH" : selectedCollection.chain,
            chainIcon: chainIcon,
          }));
        }
      })
      .catch((err) => console.error("Error fetching collections:", err));
  }, [walletaddress, selectedCollection]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "collectionId") {
      // Find collection by either id or _id
      const collection = collections.find((c) => {
        const cId = c.id || c._id || "";
        return cId === value;
      });
      if (collection) {
        console.log("Collection selected:", collection.name, "ID:", collection.id || collection._id);
        // Set chain icon based on collection chain
        const chainIcon = collection.chain === "Ethereum" ? "/eth-icon.svg" : "/itemstemp/chain-i.svg";
        setFormData((prev) => ({
          ...prev,
          collectionName: collection.name,
          chainName: collection.chain === "Ethereum" ? "ETH" : collection.chain,
          chainIcon: chainIcon,
        }));
      } else {
        console.error("Collection not found for ID:", value, "Available collections:", collections.map(c => ({ id: c.id || c._id, name: c.name })));
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

      // Verify collection name is set correctly before submitting
      const selectedCollectionData = collections.find((c) => {
        const cId = c.id || c._id || "";
        return cId === formData.collectionId;
      });
      
      const finalCollectionName = selectedCollectionData?.name || formData.collectionName;
      
      console.log("Creating NFT with:", {
        name: formData.name,
        collectionId: formData.collectionId,
        collectionName: finalCollectionName,
        selectedCollection: selectedCollectionData
      });

      // Create NFT item
      const response = await fetch("http://localhost:8081/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerWallet: address,
          name: formData.name,
          collectionName: finalCollectionName,
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
        // Navigate to items page with collection filter to show the new NFT
        if (walletaddress && formData.collectionId) {
          // Use navigate to prevent scroll to top and page reload
          navigate(`/${walletaddress}/items?collection=${formData.collectionId}`, { replace: false });
        } else if (walletaddress) {
          navigate(`/${walletaddress}/items`, { replace: false });
        }
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
      {/* Full Screen Backdrop with Black Opacity */}
      <div
        className="fixed inset-0 bg-black bg-opacity-80 z-[2100]"
        onClick={onClose}
      >
        <div
          className="fixed inset-0 z-[2100] flex flex-col p-8 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 text-white hover:text-gray-300 text-3xl z-[3100] cursor-pointer"
          >
            &times;
          </button>

          {/* Full Screen Modal Content */}
          <div className="flex-1 flex flex-col items-center justify-center w-full py-8">
            <div className="w-full max-w-4xl space-y-6">
              <h2 className="text-white font-bold text-[55px] font-sans text-center">
                Create NFT
              </h2>

             <div className="flex gap-20 w-250">
           
              <div className="flex flex-col space-y-2 w-full">
                  <label className="text-white font-semibold text-[14px]">
                    NFT Image <span className="text-red-500">*</span>
                  </label>
                  <ButtonUploadImg onFileSelect={setSelectedFile} />
                </div>
                <div className="space-y-4 w-full">
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
                    {collections.map((col) => {
                      const colId = col.id || col._id || "";
                      return (
                        <option key={colId} value={colId}>
                          {col.name}
                        </option>
                      );
                    })}
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
                    className="bg-[#141415] p-4 py-6 rounded-[8px] border border-[#181C14] text-white placeholder-gray-500 resize-none"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

            
              
              </div>
             </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6 w-250">
                <button
                  onClick={onClose}
                  className="bg-[#151517]/5 p-4 px-8 text-white font-[500] border border-[#2C2C2C] rounded-[7px] hover:bg-[#0C0C0C]/80 cursor-pointer text-[16px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-[#696FC7] p-4 px-8 text-white font-[500] rounded-[7px] hover:bg-[#5a5fb8] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-[16px]"
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

