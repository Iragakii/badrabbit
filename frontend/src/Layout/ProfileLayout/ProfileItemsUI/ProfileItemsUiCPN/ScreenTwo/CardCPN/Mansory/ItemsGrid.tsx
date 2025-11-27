import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Masonry from "react-masonry-css";
import RowCardOne from "./RowCardOne";
import { useAuth } from "../../../../../../../../Auth/AuthContext";

type ItemType = {
  id: string | number;
  imageUrl: string;
  chainIcon: string;
  chainName?: string;
  collectionName?: string;
};

interface ItemsGridProps {
  walletaddress: string;
}

const ItemsGrid = ({ walletaddress }: ItemsGridProps) => {
  const { address, isLoggedIn } = useAuth();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<ItemType[]>([]);
  const [allItems, setAllItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const collectionId = searchParams.get("collection");

  useEffect(() => {
    setLoading(true);
    if (!isLoggedIn || !address || address.toLowerCase() !== walletaddress?.toLowerCase()) {
      setItems([]);
      setAllItems([]);
      setLoading(false);
      return;
    }
    fetch(`http://localhost:8081/api/items/owner/${walletaddress}`)
      .then(res => res.ok ? res.json() : [])
      .then((data: ItemType[]) => {
        if (Array.isArray(data)) {
          setAllItems(data);
        } else {
          setAllItems([]);
        }
        setLoading(false);
      }).catch(() => {
        setAllItems([]);
        setLoading(false);
      });
  }, [isLoggedIn, address, walletaddress]);

  // Filter by collection if collectionId is provided
  useEffect(() => {
    if (collectionId && allItems.length > 0) {
      // Fetch collection name from collectionId, then filter items
      fetch(`http://localhost:8081/api/collections/${collectionId}`)
        .then(res => res.ok ? res.json() : null)
        .then((collection: { name: string } | null) => {
          if (collection) {
            const filtered = allItems.filter(item => item.collectionName === collection.name);
            setItems(filtered);
          } else {
            setItems([]);
          }
        })
        .catch(() => setItems([]));
    } else {
      setItems(allItems);
    }
  }, [collectionId, allItems]);

  if (loading) return <div>Loading...</div>;
  if (!isLoggedIn || !address || address.toLowerCase() !== walletaddress?.toLowerCase()) return null;

  const breakpointColumnsObj = {
    default: 5,
    1600: 5,
    1400: 5,
    1200: 5,
    1000: 3,
    800: 3,
    600: 2,
    400: 1,
  };
  const heightClasses = ["h-51", "h-65", "h-58", "h-62", "h-60"];

  return (
    <div className="w-full px-10 flex justify-center">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {items.map((item, index) => {
          const heightClass = heightClasses[index % heightClasses.length];
          return (
            <div key={item.id}>
              <RowCardOne
                imageUrl={item.imageUrl}
                heightClass={heightClass}
                maxWidthClass="max-w-[300px]"
                chainIcon={<img src={item.chainIcon} alt="chain icon" className="w-4 h-4" />}
                chainName={item.chainName || "ETH"}
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