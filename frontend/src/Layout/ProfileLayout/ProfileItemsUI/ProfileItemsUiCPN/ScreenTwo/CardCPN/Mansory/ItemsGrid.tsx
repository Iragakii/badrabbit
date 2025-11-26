
import Masonry from "react-masonry-css";
import RowCardOne from "./RowCardOne";

// TEMP sample items — replace with real collection/NFT items later
const sampleItems = [
  { id: 1, imageUrl: "/itemstemp/items-1.jpg", chainIcon: "/itemstemp/chain-i.svg" },
  { id: 2, imageUrl: "/itemstemp/items-2.jpg", chainIcon: "/itemstemp/chain-i.svg" },
  { id: 3, imageUrl: "/itemstemp/items-3.jpg", chainIcon: "/itemstemp/chain-i.svg" },
  { id: 4, imageUrl: "/itemstemp/items-4.jpg", chainIcon: "/itemstemp/chain-i.svg" },
  { id: 5, imageUrl: "/itemstemp/items-5.jpg", chainIcon: "/itemstemp/chain-i.svg" },
];

const ItemsGrid = () => {
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
        {sampleItems.map((item, index) => {
          const heightClass = heightClasses[index % heightClasses.length];

          return (
            <div key={item.id}>
              <RowCardOne
                imageUrl={item.imageUrl}
                heightClass={heightClass}
                maxWidthClass="max-w-[300px]"
                chainIcon={
                  <img
                    src={item.chainIcon}
                    alt="chain icon"
                    className="w-4 h-4"
                  />
                }
              />
            </div>
          );
        })}
      </Masonry>
    </div>
  );
};

export default ItemsGrid;
