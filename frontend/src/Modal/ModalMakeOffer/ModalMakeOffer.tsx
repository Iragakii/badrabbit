import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ethers } from "ethers";
import { useAuth } from "../../../Auth/AuthContext";
import { getApiUrl } from "../../config/api";
import { useNotification } from "../../components/Notification/NotificationContext";

interface ModalMakeOfferProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id?: string;
    _id?: string;
    name?: string;
    imageUrl?: string;
    collectionName?: string;
    ownerWallet?: string;
    listPrice?: number;
    listed?: boolean;
  } | null;
  onOfferCreated?: () => void;
}

const ModalMakeOffer = ({ isOpen, onClose, item, onOfferCreated }: ModalMakeOfferProps) => {
  const { address } = useAuth();
  const { showSuccess, showError, showWarning } = useNotification();
  const [offerAmount, setOfferAmount] = useState<string>("0");
  const [duration, setDuration] = useState<string>("30");
  const [priceType, setPriceType] = useState<"topOffer" | "floor">("topOffer");
  const [isVisible, setIsVisible] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [ethBalance, setEthBalance] = useState<number>(0);
  const [wethBalance, setWethBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [balanceError, setBalanceError] = useState<string>("");
  const [topOffer, setTopOffer] = useState<{ amount: number; currency: string } | null>(null);
  const [floorPrice, setFloorPrice] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [ethPrice, setEthPrice] = useState<number>(0);
  const maxAmount = 100;

  // Fetch ETH price
  useEffect(() => {
    if (isOpen) {
      fetch(getApiUrl("api/price/eth"))
        .then((res) => res.json())
        .then((data) => {
          setEthPrice(data.price || 0);
        })
        .catch((err) => {
          console.error("Error fetching ETH price:", err);
          setEthPrice(2500);
        });
    }
  }, [isOpen]);

  // Fetch wallet balance, top offer, floor price, and price history
  useEffect(() => {
    if (isOpen && address && item) {
      const itemId = item.id || item._id;
      
      // Fetch both ETH and WETH balances
      const fetchBalances = async () => {
        try {
          // Fetch ETH balance directly from MetaMask
          if (window.ethereum) {
            const { ethers } = await import("ethers");
            const provider = new ethers.BrowserProvider(window.ethereum);
            const ethBalanceWei = await provider.getBalance(address);
            const ethBal = parseFloat(ethers.formatEther(ethBalanceWei));
            setEthBalance(ethBal);

            // Fetch WETH balance
            const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
            const ERC20_ABI = [
              "function balanceOf(address) view returns (uint256)",
              "function decimals() view returns (uint8)",
            ];
            const contract = new ethers.Contract(WETH_ADDRESS, ERC20_ABI, provider);
            const wethBalanceWei = await contract.balanceOf(address);
            const decimals = await contract.decimals();
            const wethBal = parseFloat(ethers.formatUnits(wethBalanceWei, decimals));
            setWethBalance(wethBal);

            // Total balance = ETH + WETH (1:1 ratio)
            const total = ethBal + wethBal;
            setWalletBalance(total);
          } else {
            // Fallback to API if MetaMask not available
            fetch(getApiUrl(`api/wallet/${address}/weth-balance`))
              .then((res) => res.json())
              .then((data: { balance: number }) => {
                setWalletBalance(data.balance || 0);
              })
              .catch((err) => {
                console.error("Error fetching wallet balance:", err);
                setWalletBalance(0);
              });
          }
        } catch (err) {
          console.error("Error fetching balances:", err);
          setWalletBalance(0);
        }
      };
      
      fetchBalances();

      // Fetch top offer
      if (itemId) {
        fetch(getApiUrl(`api/offers/item/${itemId}/top`))
          .then((res) => res.ok ? res.json() : null)
          .then((data) => {
            if (data && data.amount) {
              setTopOffer({ amount: data.amount, currency: data.currency || "WETH" });
            } else {
              setTopOffer(null);
            }
          })
          .catch((err) => console.error("Error fetching top offer:", err));

        // Fetch price history
        fetch(getApiUrl(`api/price-history/item/${itemId}`))
          .then((res) => res.ok ? res.json() : [])
          .then((data) => {
            setPriceHistory(data || []);
          })
          .catch((err) => console.error("Error fetching price history:", err));
      }

      // Fetch collection floor price (from collection stats)
      if (item.collectionName) {
        fetch(getApiUrl(`api/collections/name/${encodeURIComponent(item.collectionName)}/stats`))
          .then((res) => res.ok ? res.json() : null)
          .then((data) => {
            if (data && data.currentPrice) {
              setFloorPrice(data.currentPrice);
            }
          })
          .catch((err) => console.error("Error fetching floor price:", err));
      }

      // Auto-fill offer amount with listed price if item is listed
      if (item.listed && item.listPrice && item.listPrice > 0) {
        setOfferAmount(item.listPrice.toFixed(4));
      } else if (topOffer && topOffer.amount > 0) {
        // Or use top offer if available
        setOfferAmount(topOffer.amount.toFixed(4));
      }
    }
  }, [isOpen, address, item]);

  // Check balance when offer amount changes
  useEffect(() => {
    const amount = parseFloat(offerAmount || "0");
    if (amount > walletBalance && walletBalance > 0) {
      const difference = (amount - walletBalance).toFixed(4);
      setBalanceError(`Offer exceeds wallet balance by ${difference} WETH (You have ${walletBalance.toFixed(4)} ETH+WETH)`);
    } else if (walletBalance === 0 && amount > 0) {
      setBalanceError("No ETH or WETH balance available");
    } else {
      setBalanceError("");
    }
  }, [offerAmount, walletBalance]);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      // Small delay to trigger animation
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
    // Wait for animation to complete before closing
    setTimeout(() => {
      onClose();
      setOfferAmount("0");
    }, 300);
  };

  const handleSubmit = async () => {
    if (!item || !address || !item.ownerWallet) {
      showError("Missing required information");
      return;
    }

    const amount = parseFloat(offerAmount || "0");
    if (amount <= 0) {
      showWarning("Please enter a valid offer amount");
      return;
    }

    if (amount > walletBalance) {
      showError("Insufficient balance");
      return;
    }

    setLoading(true);
    try {
      const itemId = item.id || item._id;
      const response = await fetch(getApiUrl("api/offers"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: itemId,
          offererWallet: address,
          ownerWallet: item.ownerWallet,
          amount: amount,
          currency: "WETH",
          durationDays: parseInt(duration),
        }),
      });

      if (response.ok) {
        const offerData = await response.json();
        console.log("Offer created:", offerData);
        showSuccess("Offer created successfully!");
        if (onOfferCreated) {
          onOfferCreated();
        }
        handleClose();
      } else {
        const errorText = await response.text();
        console.error("Error creating offer:", errorText);
        showError("Failed to create offer");
      }
    } catch (error) {
      console.error("Error:", error);
      showError("Error creating offer: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
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
              <h2 className="text-white text-3xl font-bold">Create item offer</h2>
            </div>

            {/* Price Type Selector */}
            <div className="flex items-center justify-end gap-2">
              <span className="text-gray-400 text-sm">SET PRICE TO</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPriceType("topOffer");
                    if (topOffer && topOffer.amount > 0) {
                      setOfferAmount(topOffer.amount.toFixed(4));
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                    priceType === "topOffer"
                      ? "bg-[#1F7D53] text-white"
                      : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  Top offer {topOffer ? `(${topOffer.amount.toFixed(4)} WETH)` : ''}
                </button>
                <button
                  onClick={() => {
                    setPriceType("floor");
                    if (floorPrice && floorPrice > 0) {
                      setOfferAmount(floorPrice.toFixed(4));
                    } else if (item?.listPrice && item.listPrice > 0) {
                      setOfferAmount(item.listPrice.toFixed(4));
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                    priceType === "floor"
                      ? "bg-[#1F7D53] text-white"
                      : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  Floor {floorPrice ? `(${floorPrice.toFixed(4)} WETH)` : item?.listPrice ? `(${item.listPrice.toFixed(4)} WETH)` : ''}
                </button>
              </div>
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
                <div className="grid grid-cols-5 gap-2 text-xs">
                  <div>
                    <div className="text-gray-400 mb-1">FLOOR</div>
                    <div className="text-white">
                      {floorPrice ? `${floorPrice.toFixed(4)} WETH` : item?.listPrice ? `${item.listPrice.toFixed(4)} WETH` : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">TOP OFFER</div>
                    <div className="text-white">
                      {topOffer ? `${topOffer.amount.toFixed(4)} ${topOffer.currency}` : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">LISTED PRICE</div>
                    <div className="text-white">
                      {item?.listPrice ? `${item.listPrice.toFixed(4)} WETH` : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">OFFER TOTAL</div>
                    <div className="text-white">{parseFloat(offerAmount || "0").toFixed(4)} WETH</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">OFFERED AT</div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.0001"
                        min="0"
                        max={maxAmount}
                        placeholder="0.00"
                        value={offerAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= maxAmount)) {
                            setOfferAmount(value);
                          }
                        }}
                        className="bg-[#18230F] border border-gray-700 rounded px-2 py-1 text-white text-sm w-20 focus:outline-none focus:border-[#1F7D53]"
                      />
                      <span className="text-white text-sm">WETH</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Offer Amount</span>
                <span className="text-white font-semibold">{parseFloat(offerAmount || "0").toFixed(2)} WETH</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={maxAmount}
                  step="0.01"
                  value={offerAmount || "0"}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #1F7D53 0%, #1F7D53 ${((parseFloat(offerAmount) || 0) / maxAmount) * 100}%, #2C3930 ${((parseFloat(offerAmount) || 0) / maxAmount) * 100}%, #2C3930 100%)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>0 WETH</span>
                <span>{maxAmount} WETH</span>
              </div>
              
              {/* Price History Chart Placeholder */}
              {priceHistory.length > 0 && (
                <div className="mt-4 bg-[#2C3930] rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-2">Price History</div>
                  <div className="h-32 flex items-end gap-1">
                    {priceHistory.slice(-10).map((entry, idx) => {
                      const maxPrice = Math.max(...priceHistory.map(e => e.price || 0));
                      const height = maxPrice > 0 ? ((entry.price || 0) / maxPrice) * 100 : 0;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                          <div
                            className={`w-full rounded-t ${
                              entry.type === 'offer' ? 'bg-[#1F7D53]' : 
                              entry.type === 'sale' ? 'bg-[#509488]' : 
                              'bg-gray-600'
                            }`}
                            style={{ height: `${height}%`, minHeight: '4px' }}
                            title={`${entry.type}: ${entry.price} ${entry.currency}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-[#1F7D53] rounded"></div>
                      <span>Offers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-[#509488] rounded"></div>
                      <span>Sales</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-600 rounded"></div>
                      <span>Listings</span>
                    </div>
                  </div>
                </div>
              )}
              {/* Balance Info */}
              <div className="mt-2 space-y-1">
                <div className="text-gray-400 text-xs">
                  Available: {walletBalance.toFixed(4)} ETH+WETH 
                  {ethBalance > 0 && ` (${ethBalance.toFixed(4)} ETH`}
                  {wethBalance > 0 && ` + ${wethBalance.toFixed(4)} WETH`}
                  {ethBalance > 0 && ')'}
                </div>
                {balanceError && (
                  <div className="text-red-400 text-sm">{balanceError}</div>
                )}
              </div>
            </div>

            {/* Offer Summary */}
            <div className="bg-[#2C3930] rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total offer value</span>
                <span className="text-white font-semibold">
                  {ethPrice > 0 && `($${(parseFloat(offerAmount || "0") * ethPrice).toFixed(2)}) `}
                  {parseFloat(offerAmount || "0").toFixed(4)} WETH
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Floor difference</span>
                <span className={`font-semibold ${
                  floorPrice && parseFloat(offerAmount || "0") > floorPrice 
                    ? "text-green-400" 
                    : floorPrice && parseFloat(offerAmount || "0") < floorPrice
                    ? "text-red-400"
                    : "text-white"
                }`}>
                  {floorPrice 
                    ? `${(parseFloat(offerAmount || "0") - floorPrice).toFixed(4)} WETH ${parseFloat(offerAmount || "0") > floorPrice ? '↑' : parseFloat(offerAmount || "0") < floorPrice ? '↓' : ''}`
                    : item?.listPrice 
                    ? `${(parseFloat(offerAmount || "0") - item.listPrice).toFixed(4)} WETH ${parseFloat(offerAmount || "0") > item.listPrice ? '↑' : parseFloat(offerAmount || "0") < item.listPrice ? '↓' : ''}`
                    : '-'
                  }
                </span>
              </div>
            </div>

            {/* Duration and Submit */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Duration:</span>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-[#2C3930] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#1F7D53] cursor-pointer"
                >
                  <option value="1">1 day</option>
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!offerAmount || parseFloat(offerAmount) <= 0 || loading || !!balanceError}
                className="bg-[#1F7D53] hover:bg-[#1a6a47] disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer"
              >
                {loading ? "Creating..." : "Review item offer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default ModalMakeOffer;

