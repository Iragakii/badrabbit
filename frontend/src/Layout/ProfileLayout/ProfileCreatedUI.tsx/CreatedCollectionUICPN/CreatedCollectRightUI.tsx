import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BTNCreatedCollectNavBar from "./BTNCreatedCollectNavBar";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import BTNCreatedCollectNavBarDate from "./BTNCreatedCollectNavBar";
import CreatedCollectHeaderFilter from "./CreatedCollectHeaderFilter";
import CreatedCollectHeaderFilterDate from "./CreatedCollectionFilterDate";
import ModalNFTChoice from "../../../../Modal/ModalCreateNFT/ModalNFTChoice";
import ModalCreateNFT from "../../../../Modal/ModalCreateNFT/ModalCreateNFT";
import { getApiUrl } from "../../../../../config/api";



interface Collection {
  _id: string;
  name: string;
  image: string;
  chain: string;
  type: string;
  status: string;
  ownerWallet: string;
}

const reorder = (list: Collection[], startIndex: number, endIndex: number): Collection[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const convertIpfsToHttp = (ipfsUrl: string): string => {
  if (!ipfsUrl) return "";
  if (ipfsUrl.startsWith("ipfs://")) {
    return ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return ipfsUrl;
};

const CreatedCollectRightUI = () => {
  const { walletaddress } = useParams();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  useEffect(() => {
    if (!walletaddress) return;
    fetch(getApiUrl(`api/collections/owner/${walletaddress}`))
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched collections:", data);
        setCollections(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching collections:", err);
        setLoading(false);
      });
  }, [walletaddress]);

  const onDragEnd = (result: DropResult) => {
    console.log("Drag ended", result);
    
    // Check if dropped outside the list
    if (!result.destination) {
      console.log("Dropped outside list");
      return;
    }
    
    // Check if position changed
    if (result.destination.index === result.source.index) {
      console.log("Position unchanged");
      return;
    }

    console.log("Collections before reorder:", collections);
    console.log(`Moving from index ${result.source.index} to ${result.destination.index}`);
    
    const reordered = reorder(collections, result.source.index, result.destination.index);
    console.log("Collections after reorder:", reordered);
    setCollections(reordered);
  };

  if (loading) return <div className="text-white">Loading...</div>;

  // Log collections state for debugging
  console.log("Current collections state:", collections);

  return (
    <>
      <div className="flex flex-col container mx-auto">
        <div className="flex flex-col gap-3">
          <CreatedCollectHeaderFilterDate></CreatedCollectHeaderFilterDate>
        <CreatedCollectHeaderFilter></CreatedCollectHeaderFilter>

        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="collections-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col divide-y-[0.2px] divide-gray-800"
              >
                {collections.length === 0 && !loading && (
                  <div className="text-white text-center py-10">No collections found.</div>
                )}
                
                {collections.map((col: Collection, index: number) => {
                  // Generate a unique draggableId
                  const draggableId = col._id || `collection-${index}`;
                  
                  return (
                    <Draggable 
                      key={draggableId} 
                      draggableId={draggableId} 
                      index={index}
                    >
                      {(provided, snapshot) => (
                      <div className="">
                          <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex gap-3 items-center  transition-colors ${
                            snapshot.isDragging ? "bg-[#3DB6B1] rounded-md shadow-lg scale-105" : "bg-transparent pt-2 pb-1"
                          }`}
                        >
                          {/* Drag Handle - ONLY this icon triggers drag */}
                          <div
                            {...provided.dragHandleProps}
                            className="flex-shrink-0 w-8 h-8 cursor-grab active:cursor-grabbing hover:scale-125 transition-transform flex items-center justify-center relative group"
                            title="Hold me"
                          >
                            <img
                              src="/createdui/holdme.svg"
                              alt="drag handle"
                              className="w-full h-full pointer-events-none"
                            />
                            {/* Tooltip */}
                            <div className="absolute bottom-full  left-1/2 -translate-x-1/2 px-2  text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                              Hold me
                            </div>
                          </div>

                          {/* Collection Content - Clickable to open modal */}
                          <div 
                            className="flex gap-5 items-center flex-1 cursor-pointer hover:bg-[#1a1a1a] rounded-md px-2 py-1 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCollection(col);
                              setIsChoiceModalOpen(true);
                            }}
                          >
                            <div className="relative group transition duration-300">
                              <img
                                src={convertIpfsToHttp(col.image)}
                                alt={col.name}
                                className="w-20 h-20 object-cover rounded-lg hover:scale-105 transition-transform"
                              />
                              {col.chain === "Ethereum" && (
                                <div className="p-1 rounded-[8px] bg-[#696FC7] w-6 h-6 top-[-8px] right-[-10px] absolute group-hover:scale-105 group-hover:translate-x-2.5 group-hover:rotate-6 transition duration-300">
                                  <img src="/eth-icon.svg" alt="" className="w-4 h-4" />
                                </div>
                              )}
                         
                            </div>
                            <div>
                              <h3 className="text-white font-semibold text-xs text-center">
                                {col.name}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      
      {/* Modal for choosing action */}
      {isChoiceModalOpen && selectedCollection && (
        <ModalNFTChoice
          onClose={() => {
            setIsChoiceModalOpen(false);
            setSelectedCollection(null);
          }}
          selectedCollection={selectedCollection}
          onCreateNFT={() => {
            setIsChoiceModalOpen(false);
            setIsCreateModalOpen(true);
          }}
        />
      )}

      {/* Modal for creating NFT */}
      {isCreateModalOpen && selectedCollection && (
        <ModalCreateNFT
          onClose={() => {
            setIsCreateModalOpen(false);
            setSelectedCollection(null);
          }}
          selectedCollection={selectedCollection}
        />
      )}
    </>
  );
};

export default CreatedCollectRightUI;