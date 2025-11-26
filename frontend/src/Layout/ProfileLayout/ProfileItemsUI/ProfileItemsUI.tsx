// <-- path might be different, fix to your actual import!
import { useParams } from 'react-router-dom';
import ProfileFirstFilerItem from "./ProfileItemsUiCPN/ProfileFirstFilerItem";
import ProfileSecFilterItem from "./ProfileItemsUiCPN/ProfileSecFilterItem";
import ItemsGrid from "./ProfileItemsUiCPN/ScreenTwo/CardCPN/Mansory/ItemsGrid";
import { useAuth } from '../../../../Auth/AuthContext';

const ProfileItemsUI = () => {
  const { isLoggedIn, address } = useAuth();
  const { walletaddress } = useParams();

  // Only show the items grid for the logged-in user whose address matches
  if (!isLoggedIn || !address || address.toLowerCase() !== walletaddress?.toLowerCase()) {
    return null;
  }
  return (
    <>
      <div className="flex flex-col gap-3 ">
        <ProfileFirstFilerItem />
        <ProfileSecFilterItem />
      </div>
      <div className="mt-6 ">
        <ItemsGrid walletaddress={walletaddress as string} />
      </div>
    </>
  );
};

export default ProfileItemsUI;