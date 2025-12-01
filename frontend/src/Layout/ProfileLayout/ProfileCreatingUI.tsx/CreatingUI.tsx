import { useAuth } from "../../../../Auth/AuthContext";
import CreateColle from "../ProfileCreatedUI.tsx/CreateColle";
import DefaultImgCreatedUI from "../ProfileCreatedUI.tsx/DefaultImgCreatedUI";
import TitleaDesCreatedUI from "../ProfileCreatedUI.tsx/TitleaDesCreatedUI";
import { useParams } from "react-router-dom";


const CreatingUI = () => {
  const { walletaddress } = useParams();
  const { address } = useAuth();
  
  // Check if viewing own profile
  const isOwnProfile = address && walletaddress && address.toLowerCase() === walletaddress.toLowerCase();
  
  return (
    <div className="w-full h-150">
      <div className="flex flex-col items-center justify-center space-y-8 h-full">
        <DefaultImgCreatedUI />
        <TitleaDesCreatedUI/>
        {isOwnProfile && <CreateColle />}
      </div>
    </div>
  );
};

export default CreatingUI;