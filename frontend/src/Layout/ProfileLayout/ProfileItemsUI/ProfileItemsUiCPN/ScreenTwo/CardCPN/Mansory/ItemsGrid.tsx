import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Masonry from "react-masonry-css";
import RowCardOne from "./RowCardOne";
import { useAuth } from "../../../../../../../../Auth/AuthContext";
import { getApiUrl } from "../../../../../../../config/api";


type ItemType = {
  id?: string | number;
  _id?: string | number; // MongoDB uses _id
  name?: string;
  imageUrl: string;
  chainIcon: string;
  chainName?: string;
  collectionName?: string;
  ownerWallet?: string;
  listed?: boolean;
  listPrice?: number;
};

interface ItemsGridProps {
  walletaddress: string;
}

const ItemsGrid = ({ walletaddress }: ItemsGridProps) => {
  const { address, isLoggedIn } = useAuth();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<ItemType[]>([]);
  const [allItems, setAllItems] = useState<ItemType[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const collectionId = searchParams.get("collection");

  const fetchItems = () => {
    if (!walletaddress) {
      setItems([]);
      setAllItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(getApiUrl(`api/items/owner/${walletaddress}`))
      .then(res => res.ok ? res.json() : [])
      .then((data: ItemType[]) => {
        console.log("ItemsGrid fetched items:", data.length, data);
        if (Array.isArray(data)) {
          // Normalize items to ensure id field exists (use _id if id doesn't exist)
          const normalizedItems = data.map(item => ({
            ...item,
            id: item.id || item._id || "",
          }));
          console.log("Normalized items:", normalizedItems);
          setAllItems(normalizedItems);
        } else {
          setAllItems([]);
        }
        setLoading(false);
      }).catch((err) => {
        console.error("Error fetching items:", err);
        setAllItems([]);
        setLoading(false);
      });
  };

  // Fetch collections once for any wallet address
  useEffect(() => {
    if (!walletaddress) {
      return;
    }
    fetch(getApiUrl(`api/collections/owner/${walletaddress}`))
      .then(res => res.ok ? res.json() : [])
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          console.log("ItemsGrid fetched collections:", data);
          setCollections(data);
        }
      })
      .catch((err) => console.error("Error fetching collections:", err));
  }, [isLoggedIn, address, walletaddress]);

  useEffect(() => {
    fetchItems();
    // Only refresh when collectionId changes or on mount, not continuously
    const interval = setInterval(() => {
      // Silent refresh without showing loading state
      if (isLoggedIn && address && address.toLowerCase() === walletaddress?.toLowerCase()) {
        fetch(getApiUrl(`api/items/owner/${walletaddress}`))
          .then(res => res.ok ? res.json() : [])
          .then((data: ItemType[]) => {
            if (Array.isArray(data)) {
              // Normalize items to ensure id field exists
              const normalizedItems = data.map(item => ({
                ...item,
                id: item.id || item._id || "",
              }));
              setAllItems(normalizedItems);
            }
          })
          .catch(() => {});
      }
    }, 5000); // Refresh every 5 seconds silently
    return () => clearInterval(interval);
  }, [isLoggedIn, address, walletaddress, collectionId]); // Added collectionId to dependencies

  // Filter by collection if collectionId is provided
  useEffect(() => {
    if (collectionId && allItems.length > 0 && collections.length > 0) {
      // Find collection by ID from already fetched collections
      const collection = collections.find((c) => {
        const cId = c.id || c._id || "";
        return cId === collectionId;
      });
      
      if (collection) {
        // Case-insensitive comparison
        const collectionName = collection.name || "";
        const collectionNameLower = collectionName.toLowerCase().trim();
        const filtered = allItems.filter(item => {
          const itemCollectionName = (item.collectionName || "").toLowerCase().trim();
          const matches = itemCollectionName === collectionNameLower;
          return matches;
        });
        console.log("Filtering items in ItemsGrid:", {
          collectionId,
          collectionName: collection.name,
          collectionNameLower,
          allItemsCount: allItems.length,
          filteredCount: filtered.length,
          filteredItems: filtered.map(i => ({ 
            id: i.id,
            name: i.name, 
            collectionName: i.collectionName,
            imageUrl: i.imageUrl
          })),
          allItems: allItems.map(i => ({ 
            id: i.id,
            name: i.name, 
            collectionName: i.collectionName,
            collectionNameLower: (i.collectionName || "").toLowerCase().trim()
          }))
        });
        setItems(filtered);
      } else {
        console.error("Collection not found for ID:", collectionId, "Available collections:", collections.map(c => ({ id: c.id || c._id, name: c.name })));
        setItems([]);
      }
    } else if (!collectionId) {
      // No collection filter - show all items
      console.log("No collection filter, showing all items:", allItems.length);
      setItems(allItems);
    } else if (collectionId && (allItems.length === 0 || collections.length === 0)) {
      // Collection ID exists but data not loaded yet
      console.log("Waiting for data to load...", { allItems: allItems.length, collections: collections.length });
      setItems([]);
    }
  }, [collectionId, allItems, collections]); 

  if (loading) return <div>Loading...</div>;
  if (!walletaddress) return null;

  // Dynamically adjust columns based on item count to prevent distortion
  const getBreakpointColumns = () => {
    const itemCount = items.length;
    const baseBreakpoints = {
      default: 5,
      1600: 4,
      1400: 4,
      1200: 4,
      1000: 3,
      800: 3,
      600: 2,
      400: 1,
    };

    // If we have fewer items than max columns, limit columns to item count
    if (itemCount > 0 && itemCount < 5) {
      const maxCols = Math.min(itemCount, 5);
      return {
        default: maxCols,
        1600: maxCols,
        1400: maxCols,
        1200: maxCols,
        1000: Math.min(maxCols, 3),
        800: Math.min(maxCols, 3),
        600: Math.min(maxCols, 2),
        400: 1,
      };
    }

    return baseBreakpoints;
  };

  const breakpointColumnsObj = getBreakpointColumns();
  const heightClasses = ["h-50", "h-59", "h-52", "h-55", "h-60"];

  if (items.length === 0 && !loading) {
    return (
      <div className="w-full px-10 flex justify-center items-center py-20">
        <div className="text-gray-400 text-center">
          {collectionId ? "No items found in this collection" : "No items found"}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-10 flex justify-center">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {items.map((item, index) => {
          const heightClass = heightClasses[index % heightClasses.length];
          const itemId = item.id || item._id || index;
          const imageUrl = item.imageUrl || "";
          console.log("Rendering item:", { itemId, name: item.name, imageUrl, collectionName: item.collectionName });
          
          // Find collection to get contractAddress
          const itemCollection = collections.find((c) => {
            const cName = (c.name || "").toLowerCase().trim();
            const itemCollectionName = (item.collectionName || "").toLowerCase().trim();
            return cName === itemCollectionName;
          });
          const contractAddress = itemCollection?.contractAddress || "0x0000000000000000000000000000000000000000";
          
          return (
            <div key={itemId} className="w-full">
              <RowCardOne
                imageUrl={imageUrl}
                heightClass={heightClass}
                maxWidthClass="w-full"
                chainIcon={<img src={item.chainIcon} alt="chain icon" className="w-4 h-4" />}
                chainName={item.chainName || "ETH"}
                itemName={item.name || "Unnamed NFT"}
                collectionName={item.collectionName || "Unnamed Collection"}
                itemId={itemId}
                contractAddress={contractAddress}
                ownerWallet={item.ownerWallet}
                listed={item.listed}
                listPrice={item.listPrice}
              />
               <div className="mt-7"></div>
            </div>
           
          );
        })}
      </Masonry>
    </div>
  );
};

export default ItemsGrid;