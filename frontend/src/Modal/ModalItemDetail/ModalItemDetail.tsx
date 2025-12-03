import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import ModalMakeOffer from "../ModalMakeOffer/ModalMakeOffer";
import ModalListItem from "../ModalListItem/ModalListItem";
import { getApiUrl } from "../../config/api";
import { useAuth } from "../../../Auth/AuthContext";



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
  listPrice?: number;
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
  const { address } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "orders" | "activity">("details");
  const [moreItems, setMoreItems] = useState<Item[]>([]);
  const [showMakeOffer, setShowMakeOffer] = useState(false);
  const [showListItem, setShowListItem] = useState(false);
  const [copied, setCopied] = useState(false);
  const [topOffer, setTopOffer] = useState<{ amount: number; currency: string } | null>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [acceptingOffer, setAcceptingOffer] = useState<string | null>(null);
  const [usernameMap, setUsernameMap] = useState<Map<string, string>>(new Map());
  const [collectionFloor, setCollectionFloor] = useState<number | null>(null);
  const [lastSale, setLastSale] = useState<{ price: number; count: number; average: number; last3Prices: number[] } | null>(null);
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
      let response = await fetch(getApiUrl(`api/items/id/${itemId}`));
      if (!response.ok) {
        // Fallback to the legacy route
        response = await fetch(getApiUrl(`api/items/${itemId}`));
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
          return fetch(getApiUrl(`api/collections/name/${encodeURIComponent(data.collectionName)}`))
            .then((res) => {
              if (res.ok) return res.json();
              // If not found by name, try to find by owner wallet
              if (data.ownerWallet) {
                return fetch(getApiUrl(`api/collections/owner/${data.ownerWallet}`))
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
    
    fetch(getApiUrl(`api/items/owner/${item.ownerWallet}`))
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

    // Fetch price history and offers in parallel
    Promise.all([
      fetch(getApiUrl(`api/price-history/item/${itemId}`)).then((res) => res.ok ? res.json() : []),
      fetch(getApiUrl(`api/offers/item/${itemId}`)).then((res) => res.ok ? res.json() : [])
    ]).then(([priceHistoryData, offersData]) => {
      setPriceHistory(priceHistoryData || []);
      
      // Calculate LAST SALE: average of last 3 sales + last sale price
      const sales = (priceHistoryData || []).filter((entry: any) => entry.type === "sale").sort((a: any, b: any) => {
        const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
        const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
        return timeB - timeA; // Most recent first
      });
      
      if (sales.length > 0) {
        const lastSalePrice = sales[0].price || 0;
        const last3Sales = sales.slice(0, 3).map((s: any) => s.price || 0);
        const average = last3Sales.length > 0 
          ? last3Sales.reduce((sum: number, price: number) => sum + price, 0) / last3Sales.length 
          : 0;
        
        setLastSale({
          price: lastSalePrice,
          count: sales.length,
          average: average,
          last3Prices: last3Sales
        });
      } else {
        setLastSale(null);
      }

      // Create a map of offer timestamps to owner wallets from the offers data
      const offerOwnerMap = new Map<string, string>();
      offersData.forEach((offer: any) => {
        const offerTime = new Date(offer.createdAt || 0).getTime();
        if (offer.ownerWallet) {
          offerOwnerMap.set(offerTime.toString(), offer.ownerWallet.toLowerCase());
        }
      });

      // Set activity from price history (includes sales, offers, listings, mints)
      // First, fix any reversed sales (old records with FROM = buyer, TO = seller)
      let fixedPriceHistory = (priceHistoryData || []).map((entry: any) => {
        if (entry.type === "sale" && item && item.ownerWallet && entry.fromWallet && entry.toWallet) {
          // Check if this sale record is reversed (old logic)
          // If current owner matches FROM, it's reversed - swap it
          const currentOwner = item.ownerWallet.toLowerCase();
          const fromLower = entry.fromWallet.toLowerCase();
          const toLower = entry.toWallet.toLowerCase();
          
          // If current owner matches FROM, the record is reversed (old logic)
          if (currentOwner === fromLower && currentOwner !== toLower) {
            // Swap FROM and TO
            return {
              ...entry,
              fromWallet: entry.toWallet,
              toWallet: entry.fromWallet
            };
          }
        }
        return entry;
      });
      
      let activityData = fixedPriceHistory.map((entry: any) => {
        const entryTime = new Date(entry.timestamp || entry.createdAt || 0).getTime();
        
        // For offers, try to get ownerWallet from the offers data
        if (entry.type === "offer" && (!entry.toWallet || entry.toWallet === "null" || entry.toWallet === "")) {
          // Try to match by timestamp (within 1 second tolerance)
          for (const [timeStr, ownerWallet] of offerOwnerMap.entries()) {
            const offerTime = parseInt(timeStr);
            if (Math.abs(offerTime - entryTime) < 1000) { // Within 1 second
              return {
                ...entry,
                eventType: entry.type || "transfer",
                toWallet: ownerWallet
              };
            }
          }
        }
        
        return {
          ...entry,
          eventType: entry.type || "transfer"
        };
      });

      // For offers still missing toWallet, use simpler logic: find the most recent sale before the offer
      activityData = activityData.map((entry: any) => {
        if (entry.type === "offer" && (!entry.toWallet || entry.toWallet === "null" || entry.toWallet === "")) {
          const offerTimestamp = new Date(entry.timestamp || entry.createdAt || 0).getTime();
          
          // Find the most recent sale before this offer
          const salesBeforeOffer = (priceHistoryData || [])
            .filter((e: any) => e.type === "sale" && e.fromWallet && e.toWallet)
            .filter((e: any) => {
              const eventTime = new Date(e.timestamp || e.createdAt || 0).getTime();
              return eventTime < offerTimestamp;
            })
            .sort((a: any, b: any) => {
              const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
              const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
              return timeB - timeA; // Most recent first
            });
          
          if (salesBeforeOffer.length > 0) {
            // The buyer (TO) from the most recent sale before the offer is the owner
            return {
              ...entry,
              toWallet: salesBeforeOffer[0].toWallet
            };
          }
          
          // Find the first sale after this offer - the seller (FROM) was the owner at offer time
          const saleAfterOffer = (priceHistoryData || [])
            .filter((e: any) => e.type === "sale" && e.fromWallet && e.toWallet)
            .find((e: any) => {
              const eventTime = new Date(e.timestamp || e.createdAt || 0).getTime();
              return eventTime > offerTimestamp;
            });
          
          if (saleAfterOffer && saleAfterOffer.fromWallet) {
            return {
              ...entry,
              toWallet: saleAfterOffer.fromWallet
            };
          }
          
          // Last resort: use mint owner or current item owner
          const mintEvent = activityData.find((e: any) => e.type === "mint");
          if (mintEvent && mintEvent.toWallet) {
            return {
              ...entry,
              toWallet: mintEvent.toWallet
            };
          }
          
          if (item && item.ownerWallet) {
            return {
              ...entry,
              toWallet: item.ownerWallet
            };
          }
        }
        return entry;
      });

        // Add mint event if item exists and has createdAt
        // Find the original owner by looking at the first sale (the seller was the original owner)
        if (item && item.createdAt) {
          // Find the earliest sale to get the original owner
          // Use the fixed price history (with corrected sales)
          const allSales = activityData.filter((e: any) => e.type === "sale" && e.fromWallet);
          let originalOwner = item.ownerWallet || "";
          
          if (allSales.length > 0) {
            // Sort by timestamp ascending (oldest first)
            const sortedSales = [...allSales].sort((a: any, b: any) => {
              const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
              const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
              return timeA - timeB; // Oldest first
            });
            
            // The seller (FROM) of the earliest sale is the original owner
            const earliestSale = sortedSales[0];
            console.log("Earliest sale for mint:", earliestSale);
            if (earliestSale && earliestSale.fromWallet) {
              originalOwner = earliestSale.fromWallet;
              console.log("Original owner from earliest sale:", originalOwner);
            }
          } else {
            console.log("No sales found, using current owner:", originalOwner);
          }
          
          const mintEvent = {
            type: "mint",
            eventType: "mint",
            price: null,
            amount: null,
            currency: "ETH",
            fromWallet: null,
            toWallet: originalOwner,
            timestamp: item.createdAt,
            createdAt: item.createdAt
          };
          activityData.push(mintEvent);
        }

        // Sort by timestamp (most recent first)
        activityData.sort((a: any, b: any) => {
          const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
          const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
          return timeB - timeA;
        });
        setActivity(activityData);

        // Fetch usernames for all unique wallet addresses
        const uniqueWallets = new Set<string>();
        activityData.forEach((act: any) => {
          if (act.fromWallet) uniqueWallets.add(act.fromWallet.toLowerCase());
          if (act.toWallet) uniqueWallets.add(act.toWallet.toLowerCase());
        });
        
        // Fetch usernames for all wallets
        const usernamePromises = Array.from(uniqueWallets).map(async (wallet) => {
          try {
            const res = await fetch(getApiUrl(`api/user/${wallet}`));
            if (res.ok) {
              const userData = await res.json();
              return { wallet, username: userData.username || wallet.slice(0, 6) + "..." + wallet.slice(-4) };
            }
            return { wallet, username: wallet.slice(0, 6) + "..." + wallet.slice(-4) };
          } catch {
            return { wallet, username: wallet.slice(0, 6) + "..." + wallet.slice(-4) };
          }
        });
        
        Promise.all(usernamePromises).then((results) => {
          const newMap = new Map<string, string>();
          results.forEach(({ wallet, username }) => {
            newMap.set(wallet.toLowerCase(), username);
          });
          setUsernameMap(newMap);
        });
      })
      .catch((err) => {
        console.error("Error fetching price history/offers:", err);
        setPriceHistory([]);
      });

    // Set orders from the offers data (already fetched above)
    fetch(getApiUrl(`api/offers/item/${itemId}`))
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        setOrders(data || []);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, [itemId, item]);

  // Update activity when item loads to fill in missing toWallet for offers
  useEffect(() => {
    if (item && activity.length > 0) {
      const updatedActivity = activity.map((act: any) => {
        if (act.type === "offer" && (!act.toWallet || act.toWallet === "null" || act.toWallet === "")) {
          const offerTimestamp = new Date(act.timestamp || act.createdAt || 0).getTime();
          
          // Get all ownership-changing events (sales, mints) sorted chronologically (oldest first)
          const ownershipEvents = activity
            .filter((e: any) => (e.type === "sale" || e.type === "mint") && e.toWallet)
            .sort((a: any, b: any) => {
              const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
              const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
              return timeA - timeB; // Oldest first
            });
          
          // Track ownership chronologically up to the offer timestamp
          let currentOwner = null;
          
          // Start with mint event (original owner)
          const mintEvent = ownershipEvents.find((e: any) => e.type === "mint");
          if (mintEvent) {
            currentOwner = mintEvent.toWallet;
          }
          
          // Process sales chronologically up to the offer time
          for (const event of ownershipEvents) {
            const eventTime = new Date(event.timestamp || event.createdAt || 0).getTime();
            if (eventTime <= offerTimestamp && event.type === "sale") {
              // In a sale: TO = buyer (new owner), FROM = seller (previous owner)
              // If sale happened before offer, the new owner (TO) is the owner at offer time
              currentOwner = event.toWallet;
            } else if (eventTime > offerTimestamp && event.type === "sale") {
              // If sale happened AFTER the offer, the seller (FROM) was the owner at offer time
              // This is the key fix: use FROM of future sales
              if (event.fromWallet && !currentOwner) {
                currentOwner = event.fromWallet;
              }
            }
          }
          
          // If still no owner found, check if there's a sale after the offer
          // The seller in that sale was the owner at the time of the offer
          if (!currentOwner) {
            const saleAfterOffer = ownershipEvents.find((e: any) => {
              if (e.type === "sale") {
                const eventTime = new Date(e.timestamp || e.createdAt || 0).getTime();
                return eventTime > offerTimestamp && e.fromWallet;
              }
              return false;
            });
            if (saleAfterOffer && saleAfterOffer.fromWallet) {
              currentOwner = saleAfterOffer.fromWallet;
            }
          }
          
          // Use the tracked owner
          if (currentOwner) {
            return {
              ...act,
              toWallet: currentOwner
            };
          }
          
          // Last resort: use current item owner
          if (item.ownerWallet) {
            return {
              ...act,
              toWallet: item.ownerWallet
            };
          }
        }
        return act;
      });
      
      // Only update if something changed
      const hasChanges = updatedActivity.some((act: any, index: number) => {
        const original = activity[index];
        return act.toWallet !== original.toWallet;
      });
      
      if (hasChanges) {
        setActivity(updatedActivity);
        
        // Also update username map if needed
        const newWallets = new Set<string>();
        updatedActivity.forEach((act: any) => {
          if (act.toWallet) newWallets.add(act.toWallet.toLowerCase());
        });
        
        const newWalletArray = Array.from(newWallets).filter(w => !usernameMap.has(w));
        if (newWalletArray.length > 0) {
          const usernamePromises = newWalletArray.map(async (wallet) => {
            try {
              const res = await fetch(getApiUrl(`api/user/${wallet}`));
              if (res.ok) {
                const userData = await res.json();
                return { wallet, username: userData.username || wallet.slice(0, 6) + "..." + wallet.slice(-4) };
              }
              return { wallet, username: wallet.slice(0, 6) + "..." + wallet.slice(-4) };
            } catch {
              return { wallet, username: wallet.slice(0, 6) + "..." + wallet.slice(-4) };
            }
          });
          
          Promise.all(usernamePromises).then((results) => {
            const newMap = new Map(usernameMap);
            results.forEach(({ wallet, username }) => {
              newMap.set(wallet.toLowerCase(), username);
            });
            setUsernameMap(newMap);
          });
        }
      }
    }
  }, [item, activity.length]);

  // Add mint event when item is loaded
  useEffect(() => {
    if (item && item.createdAt && activity.length > 0 && priceHistory.length > 0) {
      // Check if mint event already exists
      const hasMint = activity.some((act: any) => act.type === "mint" || act.eventType === "mint");
      if (!hasMint) {
        // Find the original owner by looking at the first sale in price history (the seller was the original owner)
        const allSales = priceHistory.filter((e: any) => e.type === "sale" && e.fromWallet);
        let originalOwner = item.ownerWallet || "";
        
        if (allSales.length > 0) {
          // Sort by timestamp ascending (oldest first)
          const sortedSales = [...allSales].sort((a: any, b: any) => {
            const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
            const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
            return timeA - timeB; // Oldest first
          });
          
          // The seller (FROM) of the earliest sale is the original owner
          const earliestSale = sortedSales[0];
          if (earliestSale && earliestSale.fromWallet) {
            originalOwner = earliestSale.fromWallet;
          }
        }
        
        const mintEvent = {
          type: "mint",
          eventType: "mint",
          price: null,
          amount: null,
          currency: "ETH",
          fromWallet: null,
          toWallet: originalOwner,
          timestamp: item.createdAt,
          createdAt: item.createdAt
        };
        const updatedActivity = [mintEvent, ...activity].sort((a: any, b: any) => {
          const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
          const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
          return timeB - timeA;
        });
        setActivity(updatedActivity);
        
        // Add to username map if needed
        if (item.ownerWallet && !usernameMap.has(item.ownerWallet.toLowerCase())) {
          fetch(getApiUrl(`api/user/${item.ownerWallet}`))
            .then((res) => res.ok ? res.json() : null)
            .then((userData) => {
              if (userData) {
                const newMap = new Map(usernameMap);
                newMap.set(item.ownerWallet!.toLowerCase(), userData.username || item.ownerWallet!.slice(0, 6) + "..." + item.ownerWallet!.slice(-4));
                setUsernameMap(newMap);
              }
            })
            .catch(() => {});
        }
      }
    }
  }, [item, activity.length, usernameMap]);

  // Fetch collection floor price when item data is loaded
  useEffect(() => {
    if (item?.collectionName) {
      const fetchCollectionFloor = async () => {
        try {
          // Try to get collection ID first, then fetch stats
          const collectionRes = await fetch(getApiUrl(`api/collections/name/${encodeURIComponent(item.collectionName || '')}`));
          if (collectionRes.ok) {
            const collectionData = await collectionRes.json();
            if (collectionData && (collectionData.id || collectionData._id)) {
              const collectionId = collectionData.id || collectionData._id;
              const statsRes = await fetch(getApiUrl(`api/collections/${collectionId}/stats`));
              if (statsRes.ok) {
                const statsData = await statsRes.json();
                if (statsData && statsData.currentPrice) {
                  setCollectionFloor(statsData.currentPrice);
                  return;
                }
              }
            }
          }
          
          // Fallback: calculate from items in collection
          const itemsRes = await fetch(getApiUrl(`api/items`));
          if (itemsRes.ok) {
            const allItems: any[] = await itemsRes.json();
            const collectionItems = allItems.filter((i: any) => 
              i.collectionName?.toLowerCase() === item.collectionName?.toLowerCase() && 
              i.listed && 
              i.listPrice
            );
            if (collectionItems.length > 0) {
              const prices = collectionItems.map((i: any) => i.listPrice).filter((p: any) => p > 0);
              if (prices.length > 0) {
                const floor = Math.min(...prices);
                setCollectionFloor(floor);
              } else {
                // If no listed items, show 0.0000 ETH
                setCollectionFloor(0);
              }
            } else {
              // If no items in collection, show 0.0000 ETH
              setCollectionFloor(0);
            }
          }
        } catch (err) {
          console.error("Error fetching collection floor:", err);
          // Default to 0 if error
          setCollectionFloor(0);
        }
      };
      
      fetchCollectionFloor();
    }
  }, [item?.collectionName]);

  // Refresh data when offer is created
  const handleOfferCreated = () => {
    if (!itemId) return;
    
    // Refresh top offer
    fetch(getApiUrl(`api/offers/item/${itemId}/top`))
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data && data.amount) {
          setTopOffer({ amount: data.amount, currency: data.currency || "WETH" });
        }
      })
      .catch((err) => console.error("Error refreshing top offer:", err));

    // Refresh price history
    fetch(getApiUrl(`api/price-history/item/${itemId}`))
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        setPriceHistory(data || []);
      })
      .catch((err) => console.error("Error refreshing price history:", err));

    // Refresh orders
    fetch(getApiUrl(`api/offers/item/${itemId}`))
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

  const handleAcceptOffer = async (offerId: string) => {
    if (!offerId) return;
    
    setAcceptingOffer(offerId);
    try {
      const response = await fetch(getApiUrl(`api/offers/${offerId}/accept`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to accept offer");
      }

      // Refresh orders and item data
      if (itemId) {
        // Refresh orders
        fetch(getApiUrl(`api/offers/item/${itemId}`))
          .then((res) => res.json())
          .then((data) => {
            setOrders(data || []);
          })
          .catch((err) => console.error("Error refreshing orders:", err));

        // Refresh item to get new owner
        fetch(getApiUrl(`api/items/id/${itemId}`))
          .then((res) => res.json())
          .then((data) => {
            setItem(data);
          })
          .catch((err) => console.error("Error refreshing item:", err));

        // Refresh top offer
        fetch(getApiUrl(`api/offers/item/${itemId}/top`))
          .then((res) => res.json())
          .then((data) => {
            if (data.amount) {
              setTopOffer({ amount: data.amount, currency: data.currency || "WETH" });
            } else {
              setTopOffer(null);
            }
          })
          .catch((err) => console.error("Error refreshing top offer:", err));

        // Refresh price history
        fetch(getApiUrl(`api/price-history/item/${itemId}`))
          .then((res) => res.json())
          .then((data) => {
            setPriceHistory(data || []);
          })
          .catch((err) => console.error("Error refreshing price history:", err));
      }

      alert("Offer accepted successfully!");
    } catch (error: any) {
      console.error("Error accepting offer:", error);
      alert(error.message || "Failed to accept offer");
    } finally {
      setAcceptingOffer(null);
    }
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
                    {topOffer ? `${topOffer.amount.toFixed(4)} ${topOffer.currency}` : "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">COLLECTION FLOOR</div>
                  <div className="text-white text-lg font-semibold">
                    {collectionFloor ? `${collectionFloor.toFixed(4)} ETH` : item?.listPrice ? `${item.listPrice.toFixed(4)} ETH` : "0.0000 ETH"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">RARITY</div>
                  <div className="text-white text-lg font-semibold">-</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">LAST SALE</div>
                  <div className="text-white text-lg font-semibold">
                    {lastSale ? (
                      <div className="flex flex-col">
                        <span>{lastSale.price.toFixed(4)} ETH</span>
                        {lastSale.last3Prices.length > 0 && (
                          <span className="text-xs text-gray-400">
                            {lastSale.last3Prices.length === 1 ? (
                              `${lastSale.last3Prices[0].toFixed(4)} / 1 = ${lastSale.average.toFixed(4)}`
                            ) : lastSale.last3Prices.length === 2 ? (
                              `(${lastSale.last3Prices[0].toFixed(4)} + ${lastSale.last3Prices[1].toFixed(4)}) / 2 = ${lastSale.average.toFixed(4)}`
                            ) : (
                              `(${lastSale.last3Prices[0].toFixed(4)} + ${lastSale.last3Prices[1].toFixed(4)} + ${lastSale.last3Prices[2].toFixed(4)}) / 3 = ${lastSale.average.toFixed(4)}`
                            )}
                          </span>
                        )}
                      </div>
                    ) : "-"}
                  </div>
                </div>
              </div>

              {/* Make Offer / List Item / Listed Button */}
              {(() => {
                // Normalize addresses for comparison
                const normalizedAddress = address?.toLowerCase().trim();
                const normalizedOwnerWallet = item?.ownerWallet?.toLowerCase().trim();
                const isOwner = normalizedAddress && normalizedOwnerWallet && 
                  normalizedAddress === normalizedOwnerWallet;
                
                // Default to not listed if not specified
                const isListed = item?.listed ?? false;
                
                if (isOwner) {
                  // Owner view: Show "List Item" if not listed, "Listed" if listed
                  if (isListed) {
                    return (
                      <button
                        className="cursor-pointer w-full bg-[#1F7D53] hover:bg-[#2A9D6A] text-white font-semibold py-4 rounded-lg transition"
                        disabled
                      >
                        Listed
                      </button>
                    );
                  } else {
                    return (
                      <button
                        onClick={() => setShowListItem(true)}
                        className="cursor-pointer w-full bg-[#1F7D53] hover:bg-[#2A9D6A] text-white font-semibold py-4 rounded-lg transition"
                      >
                        List Item
                      </button>
                    );
                  }
                } else {
                  // Non-owner view: Show "Make Offer" only if listed
                  if (isListed) {
                    return (
                      <button
                        onClick={() => setShowMakeOffer(true)}
                        className="cursor-pointer w-full bg-[#1F7D53] hover:bg-[#2A9D6A] text-white font-semibold py-4 rounded-lg transition"
                      >
                        Make offer
                      </button>
                    );
                  } else {
                    return (
                      <button
                        className="cursor-pointer w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 rounded-lg transition"
                        disabled
                      >
                        Not Listed
                      </button>
                    );
                  }
                }
              })()}

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
                        <div className="mt-4 text-white text-center">
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
                      {orders.map((order: any) => {
                        const isOwner = address && item?.ownerWallet && 
                          address.toLowerCase() === item.ownerWallet.toLowerCase();
                        const canAccept = isOwner && order.status === "pending";
                        const offerId = order.id || order._id;
                        
                        return (
                          <div key={offerId} className="bg-[#2C3930] rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-white font-medium">
                                  {order.amount?.toFixed(4)} {order.currency || "WETH"}
                                </div>
                                <div className="text-gray-400 text-sm">
                                  From {order.offererWallet?.slice(0, 6)}...{order.offererWallet?.slice(-4)}
                                </div>
                                <div className="text-gray-400 text-xs mt-1">
                                  {new Date(order.createdAt).toLocaleString()}
                                </div>
                              </div>
                              <div className="text-right flex flex-col items-end gap-2">
                                <div>
                                  <div className="text-gray-400 text-sm">Status</div>
                                  <div className={`text-sm ${
                                    order.status === "pending" ? "text-yellow-400" :
                                    order.status === "accepted" ? "text-green-400" :
                                    order.status === "rejected" ? "text-red-400" : "text-gray-400"
                                  }`}>
                                    {order.status || "pending"}
                                  </div>
                                </div>
                                {canAccept && (
                                  <button
                                    onClick={() => handleAcceptOffer(offerId)}
                                    disabled={acceptingOffer === offerId}
                                    className="px-4 py-2 bg-[#1F7D53] hover:bg-[#2A9D6A] text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {acceptingOffer === offerId ? "Accepting..." : "Accept Offer"}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">EVENT</th>
                            <th className="text-right text-gray-400 text-sm font-medium py-3 px-4">PRICE</th>
                            <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">FROM</th>
                            <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">TO</th>
                            <th className="text-right text-gray-400 text-sm font-medium py-3 px-4">TIME</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activity.map((act: any, index: number) => {
                            const eventType = act.type || act.eventType || "transfer";
                            
                            // For sale events, swap FROM/TO if needed (to handle old records with reversed logic)
                            // Sale should be: FROM = seller, TO = buyer
                            // New logic: FROM = seller (previous owner), TO = buyer (new owner = current owner)
                            // Old logic: FROM = buyer, TO = seller
                            // If current item owner matches the FROM wallet, it means the record is reversed (old logic)
                            let fromWallet = act.fromWallet || "";
                            let toWallet = act.toWallet || "";
                            
                            if (eventType === "sale" && item && item.ownerWallet && fromWallet && toWallet) {
                              // Check if this is an old record with reversed logic
                              // In new logic: current owner should be TO (buyer)
                              // In old logic: current owner would be FROM (buyer)
                              const currentOwner = item.ownerWallet.toLowerCase();
                              const fromLower = fromWallet.toLowerCase();
                              const toLower = toWallet.toLowerCase();
                              
                              // If current owner matches FROM, it's an old reversed record - swap it
                              if (currentOwner === fromLower && currentOwner !== toLower) {
                                // This is an old record with reversed logic, swap it
                                const temp = fromWallet;
                                fromWallet = toWallet;
                                toWallet = temp;
                              }
                            }
                            
                            const fromUsername = usernameMap.get(fromWallet.toLowerCase()) || 
                              (fromWallet ? (fromWallet.slice(0, 6) + "..." + fromWallet.slice(-4)) : "NullAddress");
                            const toUsername = usernameMap.get(toWallet.toLowerCase()) || 
                              (toWallet ? (toWallet.slice(0, 6) + "..." + toWallet.slice(-4)) : (address && toWallet.toLowerCase() === address.toLowerCase() ? "You" : "NullAddress"));
                            
                            // Format relative time
                            const formatRelativeTime = (date: Date) => {
                              const now = new Date();
                              const diffMs = now.getTime() - date.getTime();
                              const diffMins = Math.floor(diffMs / 60000);
                              const diffHours = Math.floor(diffMs / 3600000);
                              const diffDays = Math.floor(diffMs / 86400000);
                              const diffWeeks = Math.floor(diffDays / 7);
                              
                              if (diffMins < 1) return "Just now";
                              if (diffMins < 60) return `${diffMins}m ago`;
                              if (diffHours < 24) return `${diffHours}h ago`;
                              if (diffDays < 7) return `${diffDays}d ago`;
                              if (diffWeeks < 4) return `${diffWeeks}w ago`;
                              return date.toLocaleDateString();
                            };

                            const timestamp = act.timestamp || act.createdAt;
                            const timeStr = timestamp ? formatRelativeTime(new Date(timestamp)) : "-";
                            
                            // Get event icon and label
                            const getEventIcon = (type: string) => {
                              switch (type.toLowerCase()) {
                                case "sale":
                                  return (
                                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                      </svg>
                                    </div>
                                  );
                                case "mint":
                                  return (
                                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  );
                                case "offer":
                                  return (
                                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  );
                                default:
                                  return (
                                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  );
                              }
                            };

                            const getEventLabel = (type: string) => {
                              switch (type.toLowerCase()) {
                                case "sale": return "Sale";
                                case "mint": return "Mint";
                                case "offer": return "Offer";
                                case "listing": return "List";
                                default: return "Transfer";
                              }
                            };

                            const price = act.price || act.amount || 0;
                            const priceDisplay = price > 0 
                              ? (price < 0.0001 ? "< 0.0001 ETH" : `${price.toFixed(4)} ETH`)
                              : "-";

                            return (
                              <tr key={index} className="border-b border-gray-800 hover:bg-[#18230F] transition-colors">
                                <td className="py-4 px-4">
                                  <div className="flex items-center gap-2">
                                    {getEventIcon(eventType)}
                                    <span className="text-white text-sm">{getEventLabel(eventType)}</span>
                                  </div>
                                </td>
                                <td className="text-right py-4 px-4">
                                  <span className="text-white text-sm">{priceDisplay}</span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className="text-white text-sm">{fromUsername}</span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className="text-white text-sm">{toUsername}</span>
                                </td>
                                <td className="text-right py-4 px-4">
                                  <div className="flex items-center justify-end gap-1">
                                    <span className="text-white text-sm">{timeStr}</span>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-8">No activity available</div>
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
          listPrice: item.listPrice,
          listed: item.listed,
        } : null}
        onOfferCreated={handleOfferCreated}
      />
      <ModalListItem
        isOpen={showListItem}
        onClose={() => setShowListItem(false)}
        item={item ? {
          id: item.id || item._id,
          _id: item._id,
          name: item.name,
          imageUrl: item.imageUrl,
          collectionName: item.collectionName,
          ownerWallet: item.ownerWallet,
        } : null}
        onListed={() => {
          // Refresh item data to update listed status
          if (itemId) {
            fetch(getApiUrl(`api/items/id/${itemId}`))
              .then((res) => res.json())
              .then((data) => {
                setItem(data);
              })
              .catch((err) => console.error("Error refreshing item:", err));
          }
        }}
      />
    </>
  );
};

export default ModalItemDetail;

