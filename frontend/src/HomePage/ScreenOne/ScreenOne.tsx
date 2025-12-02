import { useEffect, useState } from "react";
import { getApiUrl, normalizeImageUrl } from "../../config/api";
import CollectionCard from "./CollectionCard";

interface Collection {
  id?: string;
  _id?: string;
  name: string;
  image: string;
  chain: string;
  ownerWallet: string;
  status?: string;
  createdAt?: string | Date;
}

interface CollectionWithStats extends Collection {
  price?: number;
  percentChange?: number;
}

const ScreenOne = () => {
  const [collections, setCollections] = useState<CollectionWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch(getApiUrl("api/collections"));
        const data: Collection[] = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          // Sort by createdAt (newest first) - assuming backend returns with createdAt
          const sortedByDate = [...data].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA; // Newest first
          });
          
          // Take only the 10 newest collections
          const newest10 = sortedByDate.slice(0, 10);
          
          // Add mock price/percentage data (can be replaced with real API later)
          const collectionsWithStats: CollectionWithStats[] = newest10.map((col) => ({
            ...col,
            // Mock data - replace with real API call when backend supports collection stats
            price: Math.random() * 10, // Random price between 0-10 ETH
            percentChange: (Math.random() - 0.5) * 20, // Random change between -10% and +10%
          }));
          
          // Sort by percentChange descending (highest first), then by price
          collectionsWithStats.sort((a, b) => {
            const percentA = a.percentChange || 0;
            const percentB = b.percentChange || 0;
            if (Math.abs(percentA - percentB) > 0.1) {
              return percentB - percentA; // Sort by percent change
            }
            return (b.price || 0) - (a.price || 0); // Then by price
          });
          
          setCollections(collectionsWithStats);
        } else {
          setCollections([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching collections:", err);
        setLoading(false);
        setCollections([]);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <div className="text-white text-lg">Loading collections...</div>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <div className="text-white text-lg">No collections available</div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">Explore Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {collections.map((collection) => {
            const collectionId = collection.id || collection._id || "";
            return (
              <CollectionCard
                key={collectionId}
                collection={collection}
                price={collection.price}
                percentChange={collection.percentChange}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScreenOne;

