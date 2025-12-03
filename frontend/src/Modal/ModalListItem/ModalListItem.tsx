import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { ethers } from "ethers";
import { useAuth } from "../../../Auth/AuthContext";
import { getApiUrl } from "../../config/api";
import { useNotification } from "../../components/Notification/NotificationContext";

interface ModalListItemProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id?: string;
    _id?: string;
    name?: string;
    imageUrl?: string;
    collectionName?: string;
    ownerWallet?: string;
  } | null;
  onListed?: () => void;
}

const ModalListItem = ({ isOpen, onClose, item, onListed }: ModalListItemProps) => {
  const { address } = useAuth();
  const { showSuccess, showError, showWarning } = useNotification();
  const [listPrice, setListPrice] = useState<string>("0");
  const [usdPrice, setUsdPrice] = useState<string>("0");
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [duration, setDuration] = useState<string>("30");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [priceType, setPriceType] = useState<"eth" | "usd">("eth");
  const [gasEstimate, setGasEstimate] = useState<string>("");
  const [gasPrice, setGasPrice] = useState<string>("");
  const [customGasPrice, setCustomGasPrice] = useState<string>("");
  const [useLowGas, setUseLowGas] = useState<boolean>(true); // Default to low gas for testing
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<"idle" | "signing" | "pending" | "success" | "error">("idle");
  const maxAmount = 100;
  const isUpdatingRef = useRef(false);

  // Marketplace contract address (update this with your deployed contract)
  // Note: Update this with your actual marketplace contract address when deployed
  const MARKETPLACE_CONTRACT = "0x0000000000000000000000000000000000000000";
  
  // ERC721 ABI for approve function
  const ERC721_ABI = [
    "function approve(address to, uint256 tokenId) external",
    "function getApproved(uint256 tokenId) external view returns (address)",
    "function ownerOf(uint256 tokenId) external view returns (address)",
  ];

  // Marketplace ABI (simplified - update with your actual contract ABI)
  const MARKETPLACE_ABI = [
    "function listItem(address nftContract, uint256 tokenId, uint256 price) external",
    "function getListing(address nftContract, uint256 tokenId) external view returns (uint256 price, address seller)",
  ];

  // Fetch ETH price for USD conversion
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch(getApiUrl("api/price/eth"));
        if (response.ok) {
          const data = await response.json();
          setEthPrice(data.price || 0);
        }
      } catch (error) {
        console.error("Error fetching ETH price:", error);
        // Fallback to default price
        setEthPrice(2500);
      }
    };
    if (isOpen) {
      fetchEthPrice();
    }
  }, [isOpen]);

  // Detect network and estimate gas fees with optimization
  useEffect(() => {
    const estimateGas = async () => {
      if (!isOpen || !address || !window.ethereum || !item) return;
      
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Get network info
        const network = await provider.getNetwork();
        setNetworkId(Number(network.chainId));
        
        // Check if testnet (Sepolia, Goerli, Mumbai, etc.)
        const isTestnet = [11155111, 5, 80001, 97, 43113].includes(Number(network.chainId));
        
        const feeData = await provider.getFeeData();
        
        if (feeData.gasPrice) {
          let optimizedGasPrice = feeData.gasPrice;
          
          // For testnets or low gas mode, use minimum gas price
          if (isTestnet || useLowGas) {
            // Use 1 gwei minimum for testnets (very cheap)
            const minGasPrice = ethers.parseUnits("1", "gwei");
            optimizedGasPrice = feeData.gasPrice < minGasPrice ? minGasPrice : feeData.gasPrice;
            
            // For mainnet with low gas mode, use 10% of current price (risky but cheaper)
            if (!isTestnet && useLowGas) {
              optimizedGasPrice = feeData.gasPrice * 10n / 100n; // 10% of current price
              if (optimizedGasPrice < ethers.parseUnits("1", "gwei")) {
                optimizedGasPrice = ethers.parseUnits("1", "gwei"); // Minimum 1 gwei
              }
            }
          }
          
          // Allow custom gas price override
          if (customGasPrice && parseFloat(customGasPrice) > 0) {
            optimizedGasPrice = ethers.parseUnits(customGasPrice, "gwei");
          }
          
          const estimatedGas = ethers.formatUnits(optimizedGasPrice, "gwei");
          setGasPrice(estimatedGas);
          
          // Optimized gas limit (reduced from 150k to 100k for simple listings)
          const gasLimit = 100000n; // Reduced gas limit
          const totalCost = optimizedGasPrice * gasLimit;
          const costInETH = ethers.formatEther(totalCost);
          setGasEstimate(costInETH);
        }
      } catch (error) {
        console.error("Error estimating gas:", error);
        // Use very low estimate for testnets
        if (networkId && [11155111, 5, 80001, 97, 43113].includes(networkId)) {
          setGasEstimate("~0.0001"); // Very cheap on testnets
        } else {
          setGasEstimate("~0.001"); // Fallback estimate
        }
      }
    };
    
    if (isOpen && listPrice && parseFloat(listPrice) > 0) {
      estimateGas();
    }
  }, [isOpen, address, listPrice, item, useLowGas, customGasPrice, networkId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      setListPrice("0");
      setUsdPrice("0");
      setPriceType("eth");
    }, 300);
  };

  // Increment/Decrement handlers that sync all fields
  const handleIncrement = () => {
    const step = priceType === "eth" ? 0.0001 : 0.01;
    const max = priceType === "eth" ? maxAmount : maxAmount * (ethPrice || 2500);
    
    if (priceType === "eth") {
      const current = parseFloat(listPrice || "0");
      const newValue = Math.min(current + step, max);
      const newValueStr = newValue.toFixed(4);
      setListPrice(newValueStr);
      if (ethPrice > 0) {
        setUsdPrice((newValue * ethPrice).toFixed(2));
      }
    } else {
      const current = parseFloat(usdPrice || "0");
      const newValue = Math.min(current + step, max);
      const newValueStr = newValue.toFixed(2);
      setUsdPrice(newValueStr);
      if (ethPrice > 0) {
        setListPrice((newValue / ethPrice).toFixed(4));
      }
    }
  };

  const handleDecrement = () => {
    const step = priceType === "eth" ? 0.0001 : 0.01;
    const min = priceType === "eth" ? 0 : 0.1; // 0.1 USD minimum
    
    if (priceType === "eth") {
      const current = parseFloat(listPrice || "0");
      const newValue = Math.max(current - step, 0);
      const newValueStr = newValue.toFixed(4);
      setListPrice(newValueStr);
      if (ethPrice > 0) {
        const usdValue = newValue * ethPrice;
        setUsdPrice(usdValue >= 0.1 ? usdValue.toFixed(2) : "0.1");
        // If USD would be less than 0.1, adjust ETH to match 0.1 USD
        if (usdValue < 0.1 && newValue > 0) {
          const minETH = 0.1 / ethPrice;
          setListPrice(minETH.toFixed(4));
          setUsdPrice("0.1");
        }
      }
    } else {
      const current = parseFloat(usdPrice || "0");
      const newValue = Math.max(current - step, min);
      const newValueStr = newValue.toFixed(2);
      setUsdPrice(newValueStr);
      if (ethPrice > 0) {
        setListPrice((newValue / ethPrice).toFixed(4));
      }
    }
  };

  // Convert between ETH and USD when price type changes
  useEffect(() => {
    if (isUpdatingRef.current) return; // Prevent infinite loop
    
    if (ethPrice > 0) {
      isUpdatingRef.current = true;
      if (priceType === "eth" && listPrice) {
        const eth = parseFloat(listPrice || "0");
        setUsdPrice((eth * ethPrice).toFixed(2));
      } else if (priceType === "usd" && usdPrice) {
        const usd = parseFloat(usdPrice || "0");
        setListPrice((usd / ethPrice).toFixed(4));
      }
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  }, [priceType]); // Only recalculate when price type changes

  const handleSubmit = async () => {
    if (!item || !address) {
      showError("Missing required information");
      return;
    }

    // Ensure we have ETH price for conversion
    if (ethPrice <= 0) {
      showWarning("Please wait for price data to load");
      return;
    }

    // Convert to ETH if user entered USD
    let priceInETH: number;
    if (priceType === "usd") {
      const usd = parseFloat(usdPrice || "0");
      if (usd < 0.1) {
        showWarning("Minimum listing price is $0.1 USD");
        return;
      }
      priceInETH = usd / ethPrice;
    } else {
      priceInETH = parseFloat(listPrice || "0");
      // Check if ETH value is at least 0.1 USD
      if (priceInETH > 0 && ethPrice > 0) {
        const usdValue = priceInETH * ethPrice;
        if (usdValue < 0.1) {
          showWarning("Minimum listing price is $0.1 USD");
          return;
        }
      }
    }

    if (priceInETH <= 0) {
      showWarning("Please enter a valid listing price (minimum $0.1 USD)");
      return;
    }

    // Check MetaMask connection
    if (!window.ethereum) {
      showError("Please install MetaMask to list items");
      return;
    }

    setLoading(true);
    setTransactionStatus("signing");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const itemId = item.id || item._id;
      
      // Get optimized gas settings
      const network = await provider.getNetwork();
      const isTestnet = [11155111, 5, 80001, 97, 43113].includes(Number(network.chainId));
      
      let optimizedGasPrice = null;
      if (useLowGas || isTestnet) {
        const feeData = await provider.getFeeData();
        if (feeData.gasPrice) {
          if (isTestnet) {
            // Testnet: Use 1 gwei minimum
            optimizedGasPrice = ethers.parseUnits("1", "gwei");
          } else if (useLowGas) {
            // Mainnet low gas: Use 10% of current or minimum 1 gwei
            optimizedGasPrice = feeData.gasPrice * 10n / 100n;
            if (optimizedGasPrice < ethers.parseUnits("1", "gwei")) {
              optimizedGasPrice = ethers.parseUnits("1", "gwei");
            }
          }
          
          // Override with custom gas price if set
          if (customGasPrice && parseFloat(customGasPrice) > 0) {
            optimizedGasPrice = ethers.parseUnits(customGasPrice, "gwei");
          }
        }
      }
      
      const message = `List NFT ${itemId} for ${priceInETH} ETH`;
      setTransactionStatus("signing");
      
      // If we have optimized gas price, log it for future contract calls
      if (optimizedGasPrice) {
        console.log("Optimized gas price:", ethers.formatUnits(optimizedGasPrice, "gwei"), "Gwei");
      }

      // Request signature from MetaMask
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, address],
      });

      if (!signature) {
        throw new Error("Transaction cancelled by user");
      }

      setTransactionStatus("pending");
      
      // If we have optimized gas price, log it for future contract calls
      if (optimizedGasPrice) {
        console.log("Optimized gas price:", ethers.formatUnits(optimizedGasPrice, "gwei"), "Gwei");
      }
      
      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(duration));
      
      // Update database
      const response = await fetch(getApiUrl(`api/items/${itemId}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listed: true,
          listPrice: priceInETH, // Always send price in ETH
          listExpiresAt: expiresAt.toISOString(),
          duration: parseInt(duration),
          signature: signature, // Store signature for verification
        }),
      });

      if (response.ok) {
        setTransactionStatus("success");
        showSuccess("Item listed successfully!");
        
        // TODO: In production, also call smart contract here:
        // const marketplaceContract = new ethers.Contract(MARKETPLACE_CONTRACT, MARKETPLACE_ABI, signer);
        // const tokenId = parseInt(itemId); // Convert to uint256
        // const priceInWei = ethers.parseEther(priceInETH.toString());
        // const tx = await marketplaceContract.listItem(collectionContractAddress, tokenId, priceInWei);
        // await tx.wait();
        
        if (onListed) {
          onListed();
        }
        setTimeout(() => {
          handleClose();
          setTransactionStatus("idle");
        }, 2000);
      } else {
        const errorText = await response.text();
        console.error("Error listing item:", errorText);
        setTransactionStatus("error");
        showError("Failed to list item");
      }
    } catch (error: any) {
      console.error("Error:", error);
      setTransactionStatus("error");
      
      if (error.code === 4001) {
        showError("Transaction rejected by user");
      } else {
        showError("Error listing item: " + (error instanceof Error ? error.message : "Unknown error"));
      }
    } finally {
      setLoading(false);
      if (transactionStatus !== "success") {
        setTimeout(() => setTransactionStatus("idle"), 3000);
      }
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[4000] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Sliding Modal from Bottom */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[4100] bg-[#18230F] rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl cursor-pointer z-10"
        >
          &times;
        </button>

        {/* Content */}
        <div className="overflow-y-auto modal-scrollbar" style={{ maxHeight: "calc(90vh - 60px)" }}>
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <h2 className="text-white text-3xl font-bold">List item for sale</h2>
            </div>

            {/* Item Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>1 item</span>
              </div>

              {/* Item Card */}
              <div className="bg-[#2C3930] rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden">
                    {item?.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-image.png";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{item?.name || "Unnamed NFT"}</div>
                    <div className="text-gray-400 text-sm">{item?.collectionName || "Unnamed Collection"}</div>
                  </div>
                </div>

                {/* Price Table */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-gray-400 mb-1">LISTING PRICE</div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setPriceType("eth")}
                          className={`px-2 py-1 rounded text-xs ${priceType === "eth" ? "bg-[#1F7D53] text-white" : "bg-gray-700 text-gray-400"}`}
                        >
                          ETH
                        </button>
                        <button
                          onClick={() => setPriceType("usd")}
                          className={`px-2 py-1 rounded text-xs ${priceType === "usd" ? "bg-[#1F7D53] text-white" : "bg-gray-700 text-gray-400"}`}
                        >
                          USD
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step={priceType === "eth" ? "0.0001" : "0.01"}
                          min={priceType === "eth" ? "0" : "0.1"}
                          max={priceType === "eth" ? maxAmount : maxAmount * (ethPrice || 2500)}
                          placeholder="0.00"
                          value={priceType === "eth" ? listPrice : usdPrice}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (priceType === "eth") {
                              if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= maxAmount)) {
                                setListPrice(value);
                                // Update USD when ETH changes
                                if (ethPrice > 0 && value !== "") {
                                  const ethVal = parseFloat(value || "0");
                                  const usdVal = ethVal * ethPrice;
                                  setUsdPrice(usdVal >= 0.1 ? usdVal.toFixed(2) : (ethVal > 0 ? "0.1" : "0"));
                                }
                              }
                            } else {
                              const maxUsd = maxAmount * (ethPrice || 2500);
                              const numValue = parseFloat(value || "0");
                              if (value === "" || (numValue >= 0.1 && numValue <= maxUsd)) {
                                setUsdPrice(value);
                                // Update ETH when USD changes
                                if (ethPrice > 0 && value !== "") {
                                  setListPrice((numValue / ethPrice).toFixed(4));
                                }
                              } else if (numValue < 0.1 && value !== "") {
                                // Allow typing but enforce minimum on blur
                                setUsdPrice(value);
                              }
                            }
                          }}
                          onBlur={(e) => {
                            // Enforce minimum on blur
                            if (priceType === "usd") {
                              const value = parseFloat(e.target.value || "0");
                              if (value < 0.1 && value > 0) {
                                setUsdPrice("0.1");
                                if (ethPrice > 0) {
                                  setListPrice((0.1 / ethPrice).toFixed(4));
                                }
                              }
                            }
                          }}
                          className="bg-[#18230F] border border-gray-700 rounded px-2 py-1 text-white text-sm w-24 focus:outline-none focus:border-[#1F7D53] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <div className="flex flex-col">
                          <button
                            onClick={handleIncrement}
                            className="w-4 h-3 flex items-center justify-center bg-[#2C3930] hover:bg-[#1F7D53] border border-gray-700 rounded-t text-white text-[10px] transition cursor-pointer"
                            type="button"
                          >
                            +
                          </button>
                          <button
                            onClick={handleDecrement}
                            className="w-4 h-3 flex items-center justify-center bg-[#2C3930] hover:bg-[#1F7D53] border border-gray-700 rounded-b text-white text-[10px] transition cursor-pointer"
                            type="button"
                          >
                            −
                          </button>
                        </div>
                      </div>
                      <span className="text-white text-sm">{priceType === "eth" ? "ETH" : "USD"}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">TOTAL VALUE</div>
                    <div className="text-white text-xs">
                      {priceType === "eth" ? (
                        <>${(parseFloat(listPrice || "0") * (ethPrice || 2500)).toFixed(2)} ({parseFloat(listPrice || "0").toFixed(4)} ETH)</>
                      ) : (
                        <>${parseFloat(usdPrice || "0").toFixed(2)} ({(parseFloat(usdPrice || "0") / (ethPrice || 2500)).toFixed(4)} ETH)</>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">DURATION</div>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="bg-[#18230F] border border-gray-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#1F7D53] cursor-pointer"
                    >
                      <option value="1">1 day</option>
                      <option value="7">7 days</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Listing Price</span>
                <span className="text-white font-semibold">
                  {priceType === "eth" 
                    ? `${parseFloat(listPrice || "0").toFixed(4)} ETH`
                    : `$${parseFloat(usdPrice || "0").toFixed(2)}`}
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={priceType === "eth" ? "0" : "0.1"}
                  max={priceType === "eth" ? maxAmount : maxAmount * (ethPrice || 2500)}
                  step={priceType === "eth" ? "0.0001" : "0.01"}
                  value={priceType === "eth" ? (listPrice || "0") : (usdPrice || "0.1")}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (priceType === "eth") {
                      setListPrice(value);
                      // Update USD when ETH changes
                      if (ethPrice > 0 && value !== "") {
                        const ethVal = parseFloat(value || "0");
                        const usdVal = ethVal * ethPrice;
                        setUsdPrice(usdVal >= 0.1 ? usdVal.toFixed(2) : (ethVal > 0 ? "0.1" : "0"));
                      }
                    } else {
                      const usdVal = parseFloat(value || "0.1");
                      if (usdVal >= 0.1) {
                        setUsdPrice(value);
                        // Update ETH when USD changes
                        if (ethPrice > 0 && value !== "") {
                          setListPrice((usdVal / ethPrice).toFixed(4));
                        }
                      }
                    }
                  }}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #1F7D53 0%, #1F7D53 ${((priceType === "eth" ? parseFloat(listPrice || "0") : Math.max(parseFloat(usdPrice || "0.1"), 0.1)) / (priceType === "eth" ? maxAmount : maxAmount * (ethPrice || 2500))) * 100}%, #2C3930 ${((priceType === "eth" ? parseFloat(listPrice || "0") : Math.max(parseFloat(usdPrice || "0.1"), 0.1)) / (priceType === "eth" ? maxAmount : maxAmount * (ethPrice || 2500))) * 100}%, #2C3930 100%)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>0 {priceType === "eth" ? "ETH" : "USD"}</span>
                <span>{priceType === "eth" ? `${maxAmount} ETH` : `$${(maxAmount * (ethPrice || 2500)).toFixed(2)}`}</span>
              </div>
            </div>

            {/* Gas Optimization Settings */}
            <div className="bg-[#2C3930] rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Gas Optimization</div>
                  <div className="text-xs text-gray-500">Use low gas for testing (may take longer)</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useLowGas}
                    onChange={(e) => setUseLowGas(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1F7D53]"></div>
                </label>
              </div>
              
              {useLowGas && (
                <div className="mt-2">
                  <label className="text-gray-400 text-xs mb-1 block">Custom Gas Price (Gwei) - Optional</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder={networkId && [11155111, 5, 80001, 97, 43113].includes(networkId) ? "1 (testnet)" : "10"}
                    value={customGasPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || parseFloat(value) >= 0.1) {
                        setCustomGasPrice(value);
                      }
                    }}
                    className="w-full bg-[#18230F] border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#1F7D53]"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {networkId && [11155111, 5, 80001, 97, 43113].includes(networkId) 
                      ? "Testnet: Use 1-2 Gwei (very cheap)" 
                      : "Mainnet: Use 1-5 Gwei (may take longer)"}
                  </div>
                </div>
              )}
            </div>

            {/* Listing Summary */}
            <div className="bg-[#2C3930] rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total listing value</span>
                <span className="text-white font-semibold">
                  ${(parseFloat(listPrice || "0") * (ethPrice || 2500)).toFixed(2)} ({parseFloat(listPrice || "0").toFixed(4)} ETH)
                </span>
              </div>
              {gasEstimate && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Estimated gas fee</span>
                  <span className={`${parseFloat(gasEstimate) < 0.001 ? "text-green-400" : "text-gray-400"}`}>
                    ~{parseFloat(gasEstimate).toFixed(6)} ETH
                    {networkId && [11155111, 5, 80001, 97, 43113].includes(networkId) && (
                      <span className="text-green-400 ml-1">(testnet - cheap!)</span>
                    )}
                  </span>
                </div>
              )}
              {gasPrice && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Gas price</span>
                  <span className="text-gray-400">{parseFloat(gasPrice).toFixed(2)} Gwei</span>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end pt-4 border-t border-gray-800">
              <button
                onClick={handleSubmit}
                disabled={!listPrice || parseFloat(listPrice) <= 0 || loading || transactionStatus === "signing" || transactionStatus === "pending"}
                className="bg-[#1F7D53] hover:bg-[#1a6a47] disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer"
              >
                {transactionStatus === "signing" ? "Signing..." : 
                 transactionStatus === "pending" ? "Processing..." :
                 transactionStatus === "success" ? "Listed!" :
                 transactionStatus === "error" ? "Try Again" :
                 loading ? "Listing..." : "Complete listing"}
              </button>
            </div>
            
            {/* Transaction Status */}
            {transactionStatus === "signing" && (
              <div className="text-center text-yellow-400 text-sm mt-2">
                Please confirm the transaction in MetaMask
              </div>
            )}
            {transactionStatus === "pending" && (
              <div className="text-center text-blue-400 text-sm mt-2">
                Transaction pending... This may take a few moments
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default ModalListItem;

