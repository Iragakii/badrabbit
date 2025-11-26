import { useEffect, useState } from "react";

import Masonry from "react-masonry-css";
import RowCardOne from "./RowCardOne";
import { useAuth } from "../../../../../../../../Auth/AuthContext";

type ItemType = {
  id: string | number;
  imageUrl: string;
  chainIcon: string;
  chainName?: string;
};

interface ItemsGridProps {
  walletaddress: string;
}

const ItemsGrid = ({ walletaddress }: ItemsGridProps) => {
  const { address, isLoggedIn } = useAuth();
  const [items, setItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!isLoggedIn || !address || address.toLowerCase() !== walletaddress?.toLowerCase()) {
      setItems([]);
      setLoading(false);
      return;
    }
    fetch(`/api/items/owner/${walletaddress}`)
      .then(res => res.ok ? res.json() : [])
      .then((data: ItemType[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          setItems([]);
        }
        setLoading(false);
      }).catch(() => {
        setItems([]);
        setLoading(false);
      });
  }, [isLoggedIn, address, walletaddress]);

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
  const heightClasses = ["h-51", "h-67", "h-58", "h-62", "h-60"];

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
            </div>
          );
        })}
      </Masonry>
    </div>
  );
};

export default ItemsGrid;