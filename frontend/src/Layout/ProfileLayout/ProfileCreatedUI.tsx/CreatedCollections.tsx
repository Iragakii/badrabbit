import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DefaultImgCreatedUI from "./DefaultImgCreatedUI";
import TitleaDesCreatedUI from "./TitleaDesCreatedUI";
import CreateColle from "./CreateColle";
import CreatedCollectionUI from "./CreatedCollectionUI";

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
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!walletaddress) return;
    fetch(`http://localhost:8081/api/collections/owner/${walletaddress}`)
      .then(res => res.json())
      .then(data => {
        setCollections(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching collections:", err);
        setLoading(false);
      });
  }, [walletaddress]);

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className=" w-full h-150">
      {collections.length === 0 ? (
       <div className="space-y-8 flex items-center justify-center"> <DefaultImgCreatedUI></DefaultImgCreatedUI>
        <TitleaDesCreatedUI></TitleaDesCreatedUI>
        <CreateColle></CreateColle></div>
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
