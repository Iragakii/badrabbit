import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../../Auth/AuthContext";
import { getApiUrl } from "../../../../config/api";

interface Collection {
  id?: string;
  _id?: string; // MongoDB sometimes uses _id
  name: string;
  image: string;
  chain: string;
  type: string;
}

interface CollectionWithCount extends Collection {
  itemCount: number;
  id: string; // Ensure id is always present
  _id: string; // Ensure _id is always present for compatibility
}

const ProfileSecFilterItem = () => {
  const { walletaddress } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { address, isLoggedIn } = useAuth();
  const [itemCount, setItemCount] = useState(0);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [collections, setCollections] = useState<CollectionWithCount[]>([]);
  const collectionId = searchParams.get("collection");

  // Fetch collections and items for any wallet address (not just logged-in user)
  useEffect(() => {
    if (!walletaddress) {
      setItemCount(0);
      setCollections([]);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch collections
        const collectionsRes = await fetch(getApiUrl(`api/collections/owner/${walletaddress}`));
        const collectionsData: Collection[] = collectionsRes.ok ? await collectionsRes.json() : [];
        
        // Fetch items
        const itemsRes = await fetch(getApiUrl(`api/items/owner/${walletaddress}`));
        const items: any[] = itemsRes.ok ? await itemsRes.json() : [];
        
        if (Array.isArray(items) && Array.isArray(collectionsData)) {
          console.log("Raw collections data:", collectionsData);
          // Calculate item count for each collection
          const collectionsWithCount: CollectionWithCount[] = collectionsData.map((col) => {
            const collectionNameLower = (col.name || "").toLowerCase().trim();
            const count = items.filter((item: any) => {
              const itemCollectionName = (item.collectionName || "").toLowerCase().trim();
              return itemCollectionName === collectionNameLower;
            }).length;
            // Get the ID (handle both id and _id)
            const collectionId = col.id || col._id || "";
            return { ...col, id: collectionId, _id: collectionId, itemCount: count };
          });
          
          console.log("Collections with count:", collectionsWithCount);
          setCollections(collectionsWithCount);
          setTotalItemCount(items.length);
          
          // Set current item count based on filter
          if (collectionId) {
            const collection = collectionsData.find((c) => (c.id || c._id) === collectionId);
            if (collection) {
              const collectionNameLower = (collection.name || "").toLowerCase().trim();
              const filtered = items.filter((item: any) => {
                const itemCollectionName = (item.collectionName || "").toLowerCase().trim();
                return itemCollectionName === collectionNameLower;
              });
              setItemCount(filtered.length);
            } else {
              setItemCount(0);
            }
          } else {
            setItemCount(items.length);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setItemCount(0);
        setCollections([]);
      }
    };

    fetchData();
    // Refresh every 5 seconds (only if viewing own profile)
    const interval = setInterval(() => {
      if (isLoggedIn && address && address.toLowerCase() === walletaddress.toLowerCase()) {
        fetchData();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [walletaddress, address, isLoggedIn, collectionId]);

  const handleCollectionFilter = (collectionId: string | null) => {
    console.log("Filter clicked:", collectionId);
    if (collectionId) {
      setSearchParams({ collection: collectionId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <>
      <div className="flex justify-between py-1 container mx-auto">
        <div className="flex gap-2">
          <span className="text-gray-400">{itemCount}</span>
          <button className="text-gray-400 uppercase">Items</button>
        </div>
      </div>
      
      {/* Collection Filters */}
      <div className="flex flex-wrap gap-3 py-2 container mx-auto relative z-10 pointer-events-auto">
        {/* All Items Filter */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCollectionFilter(null);
          }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer pointer-events-auto ${
            !collectionId
              ? "bg-[#696FC7] text-white"
              : "bg-[#141415] text-gray-400 hover:bg-[#1a1a1a] border border-[#2C2C2C]"
          }`}
        >
          All ({totalItemCount})
        </button>
        
        {/* Collection Filters */}
        {collections.length > 0 ? (
          collections.map((col) => {
            const colId = col.id || col._id || "";
            return (
              <button
                key={colId}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Collection button clicked:", colId, col.name, "Full col:", col);
                  handleCollectionFilter(colId);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer pointer-events-auto relative z-10 ${
                  collectionId === colId
                    ? "bg-[#696FC7] text-white"
                    : "bg-[#141415] text-gray-400 hover:bg-[#1a1a1a] border border-[#2C2C2C]"
                }`}
              >
                {col.itemCount}/{col.name}
              </button>
            );
          })
        ) : (
          <div className="text-gray-500 text-sm">No collections found</div>
        )}
      </div>
    </>
  );
};

export default ProfileSecFilterItem;
