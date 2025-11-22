import  { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import BTNCreatedCollectNavBar from './BTNCreatedCollectNavBar';
interface Collection {
  _id: string;
  name: string;
  image: string;
  chain: string;
  type: string;
  status: string;
  ownerWallet: string;
}

const CreatedCollectRightUI = () => {
   
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
  return (
    <>
     <div>
           <div className="p-6 flex flex-col gap-6 container mx-auto ">
                      <div className='flex justify-between bg-amber-400 p-2  container mx-auto '>
        <BTNCreatedCollectNavBar></BTNCreatedCollectNavBar>
        <BTNCreatedCollectNavBar></BTNCreatedCollectNavBar>
      </div>
          {collections.map(col => (
         
            <div key={col._id} className="flex gap-4 items-center">
                  
               
              <div>
        
              <div className='relative group transtion duration-300'>
                <img
                src={convertIpfsToHttp(col.image)}
                alt={col.name}
                className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform "
              />
               {col.chain === "Ethereum" && (
                  <div className="p-1 rounded-[8px] bg-[#696FC7] w-6 h-6 bottom-[-10px] right-[-10px] absolute group-hover:scale-105 group-hover:translate-x-2.5 group-hover:rotate-6 transtion duration-300 cursor-pointer">
                    <img src="/eth-icon.svg" alt="" className="w-4 h-4 " />
                  </div>
                )}
              </div>
              <div className="">
                <h3 className="text-white font-semibold text-lg">{col.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
     </div>
    </>
  )
}
// Helper: IPFS → HTTP gateway
function convertIpfsToHttp(ipfsUrl: string) {
  if (!ipfsUrl) return "";
  if (ipfsUrl.startsWith("ipfs://")) {
    return ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return ipfsUrl;
}

export default CreatedCollectRightUI