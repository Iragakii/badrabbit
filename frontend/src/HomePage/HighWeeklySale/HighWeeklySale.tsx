import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiUrl, normalizeImageUrl } from "../../config/api";

interface WeeklySaleItem {
  id?: string;
  _id?: string;
  name: string;
  imageUrl: string;
  collectionName: string;
  chainName: string;
  chainIcon: string;
  ownerWallet: string;
  price?: number;
  volume?: number;
}

const HighWeeklySale = () => {
  const [items, setItems] = useState<WeeklySaleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  
  // Group items into pages (4 items per page to ensure pagination works with 5-6 items)
  const itemsPerPage = 4;
  const totalPages = items.length > 0 ? Math.ceil(Math.min(items.length, 10) / itemsPerPage) : 0;
  // Show arrows if there are more than 4 items (so 5+ items will show arrows)
  const showArrows = items.length > 4;

  useEffect(() => {
    const fetchWeeklySales = async () => {
      try {
        // Fetch all items from backend
        const itemsRes = await fetch(getApiUrl("api/items"));
        let allItems: any[] = [];
        
        if (itemsRes.ok) {
          allItems = await itemsRes.json();
          if (!Array.isArray(allItems)) {
            allItems = [];
          }
        } else {
          // Fallback: fetch from collections if direct endpoint fails
          const collectionsRes = await fetch(getApiUrl("api/collections"));
          const collections: any[] = await collectionsRes.ok ? await collectionsRes.json() : [];
          
          // Fetch items for each collection owner (limited to first 10 for performance)
          const itemPromises = collections.slice(0, 10).map(async (col) => {
            try {
              const res = await fetch(getApiUrl(`api/items/owner/${col.ownerWallet}`));
              if (res.ok) {
                const ownerItems = await res.json();
                return Array.isArray(ownerItems) ? ownerItems : [];
              }
              return [];
            } catch {
              return [];
            }
          });
          
          const itemsArrays = await Promise.all(itemPromises);
          allItems = itemsArrays.flat();
        }
        
        // Filter listed items and fetch real stats
        const listedItemsWithStats = await Promise.all(
          allItems
            .filter((item: any) => item.listed)
            .slice(0, 10)
            .map(async (item: any) => {
              try {
                // Fetch item stats from backend
                const statsRes = await fetch(getApiUrl(`api/items/${item.id || item._id}/stats`));
                if (statsRes.ok) {
                  const stats = await statsRes.json();
                  return {
                    ...item,
                    price: stats.currentPrice || undefined,
                    volume: stats.weeklyVolume || undefined,
                  };
                }
              } catch (err) {
                // Silently fail - stats endpoint may not be available yet
              }
              // Return without price/volume if stats fetch fails
              return {
                ...item,
                price: undefined,
                volume: undefined,
              };
            })
        );
        
        // Sort by volume descending, then by price
        const listedItems = listedItemsWithStats
          .sort((a: any, b: any) => {
            const volumeA = a.volume ?? 0;
            const volumeB = b.volume ?? 0;
            if (Math.abs(volumeA - volumeB) > 0.01) {
              return volumeB - volumeA; // Sort by volume
            }
            const priceA = a.price ?? 0;
            const priceB = b.price ?? 0;
            return priceB - priceA; // Then by price
          })
          .slice(0, 10); // Top 10 items only
        
        setItems(listedItems);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching weekly sales:", err);
        setLoading(false);
      }
    };

    fetchWeeklySales();
  }, []);

  const handleItemClick = (item: WeeklySaleItem) => {
    const itemId = item.id || item._id || "";
    if (itemId && item.ownerWallet) {
      navigate(`/${item.ownerWallet}/item/${itemId}/0x0000000000000000000000000000000000000000`);
    }
  };

  const nextPage = () => {
    if (showArrows && totalPages > 0) {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }
  };

  const prevPage = () => {
    if (showArrows && totalPages > 0) {
      setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <div className="text-white text-lg">Loading weekly sales...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return null; // Don't show section if no items
  }

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const currentPageItems = getCurrentPageItems();

  return (
    <div className="w-full py-12 px-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Highest Weekly Sales</h2>
            <p className="text-gray-400">Top performing NFTs this week</p>
          </div>
        </div>

        {/* Carousel Container with Navigation */}
        <div className="relative">
          {/* Navigation Arrows */}
          {showArrows && (
            <>
              <button
                onClick={prevPage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 border border-gray-700 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 cursor-pointer"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextPage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 border border-gray-700 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 cursor-pointer"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Cards Container */}
          <div className="overflow-hidden px-12 py-4 relative">
            <div 
              className="flex gap-6 justify-start transition-opacity duration-[9200ms] ease-in-out"
              key={currentPage}
            >
              {currentPageItems.map((item, itemIndex) => {
                const itemId = item.id || item._id || `item-${itemIndex}`;
                const imageUrl = normalizeImageUrl(item.imageUrl) || "/defaultava.png";
                
                return (
                  <div
                    key={`${itemId}-page-${currentPage}`}
                    onClick={() => handleItemClick(item)}
                    className="flex-shrink-0 w-64 cursor-pointer group animate-fade-in"
                    style={{
                      animationDelay: `${itemIndex * 0.05}s`
                    }}
                  >
                    <div className="bg-[#212121] rounded-xl overflow-hidden border border-gray-800 hover:border-[#3DB6B1] transition-all duration-300 transform group-hover:scale-105">
                      {/* Image */}
                      <div className="w-full aspect-square relative overflow-hidden bg-gray-900">
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            if (e.currentTarget.src !== "/defaultava.png") {
                              e.currentTarget.src = "/defaultava.png";
                            }
                          }}
                        />
                        {/* Chain badge */}
                        <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/70 flex items-center justify-center border border-gray-700/50">
                          <img
                            src={item.chainIcon || "/itemstemp/chain-i.svg"}
                            alt={item.chainName || "ETH"}
                            className="w-5 h-5"
                          />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="text-white font-semibold text-sm mb-2 truncate">
                          {item.name}
                        </h3>
                        <p className="text-gray-400 text-xs mb-3 truncate">
                          {item.collectionName}
                        </p>
                        
                        {/* Price and Volume */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-500 text-xs">Price</p>
                            <p className="text-white font-bold text-sm">
                              {item.price?.toFixed(4) || "N/A"} {item.chainName || "ETH"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-500 text-xs">7d Volume</p>
                            <p className="text-[#3DB6B1] font-bold text-sm">
                              {item.volume?.toFixed(2) || "0"} ETH
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots Indicator */}
          {showArrows && totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentPage
                      ? "bg-[#3DB6B1] w-8"
                      : "bg-gray-600 hover:bg-gray-500 cursor-pointer"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HighWeeklySale;

