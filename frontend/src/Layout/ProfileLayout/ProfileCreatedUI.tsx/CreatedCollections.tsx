import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import DefaultImgCreatedUI from "./DefaultImgCreatedUI";
import TitleaDesCreatedUI from "./TitleaDesCreatedUI";
import CreateColle from "./CreateColle";
import CreatedCollectionUI from "./CreatedCollectionUI";
import { getApiUrl } from "../../../config/api";
import { useAuth } from "../../../../Auth/AuthContext";


interface Collection {
  _id: string;
  name: string;
  image: string;
  chain: string;
  type: string;
  status: string;
  ownerWallet: string;
}

export default function CreatedCollections() {
  const { walletaddress } = useParams();
  const location = useLocation();
  const { address } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Check if viewing own profile
  const isOwnProfile = address && walletaddress && address.toLowerCase() === walletaddress.toLowerCase();

  useEffect(() => {
    if (!walletaddress) return;
    setLoading(true);
    fetch(getApiUrl(`api/collections/owner/${walletaddress}`))
      .then((res) => res.json())
      .then((data) => {
        setCollections(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching collections:", err);
        setLoading(false);
      });
  }, [walletaddress, location.pathname]); // Refresh when walletaddress or pathname changes

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className=" w-full h-150">
      {collections.length === 0 ? (
<div className="flex flex-col items-center justify-center space-y-8 h-full">
          
          <DefaultImgCreatedUI></DefaultImgCreatedUI>
          <TitleaDesCreatedUI></TitleaDesCreatedUI>
          {isOwnProfile && <CreateColle></CreateColle>}
        </div>
      ) : (
        <div className="">
          <CreatedCollectionUI></CreatedCollectionUI>
        </div>
      )}
    </div>
  );
}

// Helper: IPFS → HTTP gateway
function convertIpfsToHttp(ipfsUrl: string) {
  if (!ipfsUrl) return "";
  if (ipfsUrl.startsWith("ipfs://")) {
    return ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return ipfsUrl;
}
