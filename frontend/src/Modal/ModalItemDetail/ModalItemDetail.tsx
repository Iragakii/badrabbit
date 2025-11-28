import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import ModalMakeOffer from "../ModalMakeOffer/ModalMakeOffer";

interface Item {
  id?: string;
  _id?: string;
  name?: string;
  collectionName?: string;
  imageUrl?: string;
  chainName?: string;
  chainIcon?: string;
  ownerWallet?: string;
  listed?: boolean;
  supply?: number;
  description?: string;
  createdAt?: string;
}

interface Collection {
  id?: string;
  _id?: string;
  name?: string;
  contractAddress?: string;
  chain?: string;
  type?: string;
  image?: string;
}

interface ModalItemDetailProps {
  onClose: () => void;
}

// Generate tokenId from item ID (hash-based conversion)
const generateTokenId = (itemId: string | undefined): string => {
  if (!itemId) return "0";
  // Convert MongoDB ObjectId to a numeric tokenId
  // Take first 8 characters and convert to number, then to string
  const hash = itemId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  return Math.abs(hash).toString();
};

const ModalItemDetail = ({ onClose }: ModalItemDetailProps) => {
  const { walletaddress, itemId, contractAddress } = useParams<{
    walletaddress: string;
    itemId: string;
    contractAddress: string;
  }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "orders" | "activity">("details");
  const [moreItems, setMoreItems] = useState<Item[]>([]);
  const [showMakeOffer, setShowMakeOffer] = useState(false);
  const [copied, setCopied] = useState(false);
  const [topOffer, setTopOffer] = useState<{ amount: number; currency: string } | null>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [expandedSections, setExpandedSections] = useState<{
    traits: boolean;
    priceHistory: boolean;
    about: boolean;
    blockchain: boolean;
    moreFromCollection: boolean;
  }>({
    traits: false,
    priceHistory: false,
    about: false,
    blockchain: false,
    moreFromCollection: false,
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (!itemId) {
      setLoading(false);
      return;
    }

    // Fetch item details - try both routes
    const fetchItem = async () => {
      // First try the specific route
      let response = await fetch(`http://localhost:8081/api/items/id/${itemId}`);
      if (!response.ok) {
        // Fallback to the legacy route
        response = await fetch(`http://localhost:8081/api/items/${itemId}`);
      }
      if (!response.ok) {
        throw new Error("Item not found");
      }
      return response.json();
    };
    
    fetchItem()
      .then((data: Item) => {
        console.log("Fetched item:", data);
        setItem(data);
        
        // Fetch collection by name to get contractAddress
        if (data.collectionName) {
          return fetch(`http://localhost:8081/api/collections/name/${encodeURIComponent(data.collectionName)}`)
            .then((res) => {
              if (res.ok) return res.json();
              // If not found by name, try to find by owner wallet
              if (data.ownerWallet) {
                return fetch(`http://localhost:8081/api/collections/owner/${data.ownerWallet}`)
                  .then((res2) => {
                    if (res2.ok) return res2.json().then((collections: Collection[]) => {
                      return collections.find((c) => 
                        (c.name || "").toLowerCase().trim() === (data.collectionName || "").toLowerCase().trim()
                      ) || null;
                    });
                    return null;
                  })
                  .catch(() => null);
              }
              return null;
            })
            .catch(() => null);
        }
        return null;
      })
      .then((collectionData: Collection | null) => {
        if (collectionData) {
          console.log("Fetched collection:", collectionData);
          setCollection(collectionData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching item:", err);
        setLoading(false);
      });
  }, [itemId]);

  // Fetch more items from the same collection
  useEffect(() => {
    if (!item?.collectionName || !item?.ownerWallet) return;
    
    fetch(`http://localhost:8081/api/items/owner/${item.ownerWallet}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data: Item[]) => {
        // Filter items from the same collection, excluding the current item
        const currentItemId = item.id || item._id;
        const filtered = data.filter((i) => {
          const itemId = i.id || i._id;
          return (
            (i.collectionName || "").toLowerCase().trim() === (item.collectionName || "").toLowerCase().trim() &&
            itemId !== currentItemId
          );
        });
        setMoreItems(filtered.slice(0, 4)); // Limit to 4 items
      })
      .catch((err) => console.error("Error fetching more items:", err));
  }, [item?.collectionName, item?.ownerWallet, item?.id, item?._id]);

  // Fetch top offer, price history, orders, and activity
  useEffect(() => {
    if (!itemId) return;

    // Fetch top offer
    fetch(`http://localhost:8081/api/offers/item/${itemId}/top`)
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
    fetch(`http://localhost:8081/api/price-history/item/${itemId}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        setPriceHistory(data || []);
      })
      .catch((err) => console.error("Error fetching price history:", err));

    // Fetch orders (offers)
    fetch(`http://localhost:8081/api/offers/item/${itemId}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        setOrders(data || []);
        // Also set as activity
        setActivity(data || []);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, [itemId]);

  // Refresh data when offer is created
  const handleOfferCreated = () => {
    if (!itemId) return;
    
    // Refresh top offer
    fetch(`http://localhost:8081/api/offers/item/${itemId}/top`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data && data.amount) {
          setTopOffer({ amount: data.amount, currency: data.currency || "WETH" });
        }
      })
      .catch((err) => console.error("Error refreshing top offer:", err));

    // Refresh price history
    fetch(`http://localhost:8081/api/price-history/item/${itemId}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        setPriceHistory(data || []);
      })
      .catch((err) => console.error("Error refreshing price history:", err));

    // Refresh orders
    fetch(`http://localhost:8081/api/offers/item/${itemId}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        setOrders(data || []);
        setActivity(data || []);
      })
      .catch((err) => console.error("Error refreshing orders:", err));
  };

  const handleClose = () => {
    // Navigate back to items page
    if (walletaddress) {
      navigate(`/${walletaddress}/items`);
    } else {
      navigate("/profile");
    }
    onClose();
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCopyUrl = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const tokenId = generateTokenId(item?._id || item?.id);
  const finalContractAddress = contractAddress || collection?.contractAddress || "0x0000000000000000000000000000000000000000";

  if (loading) {
    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-90 z-[3000] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>,
      document.body
    );
  }

  if (!item) {
    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-90 z-[3000] flex items-center justify-center">
        <div className="text-white text-xl">Item not found</div>
        <button onClick={handleClose} className="ml-4 text-blue-400 hover:text-blue-300 cursor-pointer">
          Close
        </button>
      </div>,
      document.body
    );
  }

  const modalContent = (
    <>
      {/* Full Screen Backdrop */}
      <div
        className="fixed inset-0 bg-[#18230F] z-[3000] overflow-y-auto modal-scrollbar"
        onClick={handleClose}
      >
        <div
          className="min-h-screen flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-white hover:text-gray-300 text-4xl z-[3100] cursor-pointer bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
          >
            &times;
          </button>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row flex-1 pt-20 pb-10 px-4 lg:px-8 gap-8 max-w-7xl mx-auto w-full">
            {/* Left Panel - Image */}
            <div className="w-full lg:w-1/2 flex-shrink-0">
              <div className="sticky top-24">
                <img
                  src={item.imageUrl || "/placeholder-image.png"}
                  alt={item.name || "NFT"}
                  className="w-full rounded-2xl object-contain bg-gray-900"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder-image.png";
                  }}
                />
              </div>
            </div>

            {/* Right Panel - Details */}
            <div className="w-full lg:w-1/2 flex flex-col space-y-6 bg-[#255F38] p-2 pb-0 rounded-[8px]">
              {/* Title and Actions */}
              <div className="flex items-start justify-between">
                <h1 className="text-white text-4xl font-bold">{item.name || "Unnamed NFT"}</h1>
                <div className="flex gap-3">
                  <button
                    onClick={handleCopyUrl}
                    className="p-2 hover:bg-gray-800 rounded-lg transition cursor-pointer relative"
                    title="Copy URL"
                  >
                    {copied ? (
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition cursor-pointer">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition cursor-pointer">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Collection and Owner */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-yellow-400 text-sm">😊</span>
                  </div>
                  <span className="text-white font-medium">{item.collectionName || "Unnamed Collection"}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">Owned by {item.ownerWallet?.slice(0, 6)}...{item.ownerWallet?.slice(-4)}</span>
              </div>

              {/* Token Standard and Chain */}
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-gray-800 text-white text-sm rounded">
                  {collection?.type || "ERC1155"}
                </span>
                <span className="px-3 py-1 bg-gray-800 text-white text-sm rounded flex items-center gap-1">
                  {item.chainName || "POLYGON"}
                  {item.chainIcon && (
                    <img src={item.chainIcon} alt="chain" className="w-4 h-4" />
                  )}
                </span>
              </div>

              {/* Stats Table */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#2C3930] rounded-lg">
                <div>
                  <div className="text-gray-400 text-sm mb-1">TOP OFFER</div>
                  <div className="text-white text-lg font-semibold">
                    {topOffer ? `${topOffer.amount.toFixed(2)} ${topOffer.currency}` : "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">COLLECTION FLOOR</div>
                  <div className="text-white text-lg font-semibold">-</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">RARITY</div>
                  <div className="text-white text-lg font-semibold">-</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">LAST SALE</div>
                  <div className="text-white text-lg font-semibold">-</div>
                </div>
              </div>

              {/* Make Offer Button */}
              <button
                onClick={() => setShowMakeOffer(true)}
                className="cursor-pointer w-full bg-[#1F7D53] hover:bg-gray-700 text-white font-semibold py-4 rounded-lg transition"
              >
                Make offer
              </button>

              {/* Tabs */}
              <div className="flex border-b border-gray-800">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`px-6 py-3 font-medium transition cursor-pointer ${
                    activeTab === "details"
                      ? "text-white border-b-2 border-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`px-6 py-3 font-medium transition cursor-pointer ${
                    activeTab === "orders"
                      ? "text-white border-b-2 border-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`px-6 py-3 font-medium transition cursor-pointer ${
                    activeTab === "activity"
                      ? "text-white border-b-2 border-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Activity
                </button>
              </div>

              {/* Tab Content */}
              <div className="space-y-4 relative pb-0">
                {/* Details Tab */}
                <div
                  className={`transition-opacity duration-300 ${
                    activeTab === "details" ? "opacity-100 block" : "opacity-0 hidden"
                  }`}
                >
                  <>
                    {/* Traits */}
                    <div className="border-b border-gray-800">
                      <button
                        onClick={() => toggleSection("traits")}
                        className="w-full flex  text-white hover:text-gray-300 transition cursor-pointer py-3 relative"
                      >
                        <div className="flex gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          <span className="font-medium">Traits</span>
                        </div>
                        <svg
                          className={`w-5 h-5 transition-transform absolute right-0 ${expandedSections.traits ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedSections.traits && (
                        <div className="mt-4 text-gray-400 text-center">No traits available</div>
                      )}
                    </div>

                    {/* Price History */}
                    <div className="border-b border-gray-800">
                      <button
                        onClick={() => toggleSection("priceHistory")}
                        className="w-full flex  text-white hover:text-gray-300 transition cursor-pointer py-3 relative"
                      >
                        <div className="flex  gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">Price history</span>
                        </div>
                        <svg
                          className={`w-5 h-5 transition-transform absolute right-0 ${expandedSections.priceHistory ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedSections.priceHistory && (
                        <div className="mt-4">
                          {priceHistory.length > 0 ? (
                            <div className="space-y-4">
                              {/* Simple Chart Visualization */}
                              <div className="h-48 bg-[#18230F] rounded-lg p-4 relative">
                                <div className="flex items-end justify-between h-full gap-1">
                                  {priceHistory.slice(0, 10).map((entry, index) => {
                                    const maxPrice = Math.max(...priceHistory.map((e: any) => e.price || 0));
                                    const height = maxPrice > 0 ? ((entry.price || 0) / maxPrice) * 100 : 0;
                                    return (
                                      <div
                                        key={index}
                                        className="flex-1 bg-[#1F7D53] rounded-t transition-all hover:bg-[#1a6a47] cursor-pointer"
                                        style={{ height: `${Math.max(height, 5)}%` }}
                                        title={`${entry.price?.toFixed(2)} ${entry.currency || "WETH"} - ${new Date(entry.timestamp).toLocaleDateString()}`}
                                      />
                                    );
                                  })}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-2 pb-1">
                                  <span>Oldest</span>
                                  <span>Latest</span>
                                </div>
                              </div>
                              {/* Price History List */}
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {priceHistory.map((entry: any, index: number) => (
                                  <div key={index} className="flex justify-between items-center text-sm py-2 border-b border-gray-800">
                                    <div>
                                      <div className="text-white">{entry.type || "offer"}</div>
                                      <div className="text-gray-400 text-xs">
                                        {new Date(entry.timestamp).toLocaleString()}
                                      </div>
                                    </div>
                                    <div className="text-white font-semibold">
                                      {entry.price?.toFixed(2)} {entry.currency || "WETH"}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-center">No price history available</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* About */}
                    <div className="border-b border-gray-800">
                      <button
                        onClick={() => toggleSection("about")}
                        className="w-full flex  text-white hover:text-gray-300 transition cursor-pointer py-3 relative"
                      >
                        <div className="flex  gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="font-medium">About</span>
                        </div>
                        <svg
                          className={`w-5 h-5 transition-transform absolute right-0 ${expandedSections.about ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedSections.about && (
                        <div className="mt-4 text-gray-400 text-center">
                          {item.description || "No description available"}
                        </div>
                      )}
                    </div>

                    {/* Blockchain Details */}
                    <div className="border-b border-gray-800">
                      <button
                        onClick={() => toggleSection("blockchain")}
                        className="w-full flex  text-white hover:text-gray-300 transition cursor-pointer py-3 relative"
                      >
                        <div className="flex  gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span className="font-medium">Blockchain details</span>
                        </div>
                        <svg
                          className={`w-5 h-5 transition-transform absolute right-0 ${expandedSections.blockchain ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedSections.blockchain && (
                        <div className="mt-4 space-y-2 text-sm text-center">
                          <div className="flex justify-between text-gray-400">
                            <span>Contract Address:</span>
                            <span className="text-white font-mono">{finalContractAddress}</span>
                          </div>
                          <div className="flex justify-between text-gray-400">
                            <span>Token ID:</span>
                            <span className="text-white font-mono">{tokenId}</span>
                          </div>
                          <div className="flex justify-between text-gray-400">
                            <span>Token Standard:</span>
                            <span className="text-white">{collection?.type || "ERC1155"}</span>
                          </div>
                          <div className="flex justify-between text-gray-400">
                            <span>Chain:</span>
                            <span className="text-white">{item.chainName || "POLYGON"}</span>
                          </div>
                          <div className="flex justify-between text-gray-400">
                            <span>Supply:</span>
                            <span className="text-white">{item.supply || 1}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* More from Collection */}
                    <div className=" border-gray-800">
                      <button
                        onClick={() => toggleSection("moreFromCollection")}
                        className="w-full flex  text-white hover:text-gray-300 transition cursor-pointer py-3 relative"
                      >
                        <div className="flex  gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <span className="font-medium">More from Collection</span>
                        </div>
                        <svg
                          className={`w-5 h-5 transition-transform absolute right-0 ${expandedSections.moreFromCollection ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedSections.moreFromCollection && (
                        <div className="mt-4">
                          {moreItems.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                              {moreItems.map((moreItem) => {
                                const moreItemId = moreItem.id || moreItem._id;
                                return (
                                  <div
                                    key={moreItemId}
                                    onClick={() => {
                                      const finalContractAddress = contractAddress || collection?.contractAddress || "0x0000000000000000000000000000000000000000";
                                      navigate(`/${walletaddress}/item/${moreItemId}/${finalContractAddress}`);
                                    }}
                                    className="cursor-pointer group"
                                  >
                                    <img
                                      src={moreItem.imageUrl || "/placeholder-image.png"}
                                      alt={moreItem.name || "NFT"}
                                      className="w-full rounded-lg object-cover aspect-square group-hover:opacity-80 transition"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/placeholder-image.png";
                                      }}
                                    />
                                    <div className="mt-2 text-white text-sm font-medium truncate text-center">
                                      {moreItem.name || "Unnamed NFT"}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-gray-400 text-center">No other items in this collection</div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                </div>

                {/* Orders Tab */}
                <div
                  className={`transition-opacity duration-300 ${
                    activeTab === "orders" ? "opacity-100 block" : "opacity-0 hidden"
                  }`}
                >
                  {orders.length > 0 ? (
                    <div className="space-y-3">
                      {orders.map((order: any) => (
                        <div key={order.id || order._id} className="bg-[#2C3930] rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-white font-medium">
                                {order.amount?.toFixed(2)} {order.currency || "WETH"}
                              </div>
                              <div className="text-gray-400 text-sm">
                                From {order.offererWallet?.slice(0, 6)}...{order.offererWallet?.slice(-4)}
                              </div>
                              <div className="text-gray-400 text-xs mt-1">
                                {new Date(order.createdAt).toLocaleString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-gray-400 text-sm">Status</div>
                              <div className={`text-sm ${
                                order.status === "pending" ? "text-yellow-400" :
                                order.status === "accepted" ? "text-green-400" :
                                order.status === "rejected" ? "text-red-400" : "text-gray-400"
                              }`}>
                                {order.status || "pending"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400">No orders available</div>
                  )}
                </div>

                {/* Activity Tab */}
                <div
                  className={`transition-opacity duration-300 ${
                    activeTab === "activity" ? "opacity-100 block" : "opacity-0 hidden"
                  }`}
                >
                  {activity.length > 0 ? (
                    <div className="space-y-3">
                      {activity.map((act: any, index: number) => (
                        <div key={act.id || act._id || index} className="bg-[#2C3930] rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-white font-medium">
                                {act.type === "offer" ? "Offer" : act.type || "Activity"}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {act.fromWallet ? `${act.fromWallet.slice(0, 6)}...${act.fromWallet.slice(-4)}` : ""}
                                {act.toWallet ? ` → ${act.toWallet.slice(0, 6)}...${act.toWallet.slice(-4)}` : ""}
                              </div>
                              <div className="text-gray-400 text-xs mt-1">
                                {new Date(act.timestamp || act.createdAt).toLocaleString()}
                              </div>
                            </div>
                            <div className="text-white font-semibold">
                              {act.price?.toFixed(2)} {act.currency || "WETH"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400">No activity available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {createPortal(modalContent, document.body)}
      <ModalMakeOffer
        isOpen={showMakeOffer}
        onClose={() => setShowMakeOffer(false)}
        item={item ? {
          id: item.id || item._id,
          _id: item._id,
          name: item.name,
          imageUrl: item.imageUrl,
          collectionName: item.collectionName,
          ownerWallet: item.ownerWallet,
        } : null}
        onOfferCreated={handleOfferCreated}
      />
    </>
  );
};

export default ModalItemDetail;

