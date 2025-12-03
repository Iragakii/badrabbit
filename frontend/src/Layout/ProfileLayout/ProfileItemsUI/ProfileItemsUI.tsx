// <-- path might be different, fix to your actual import!
import { useParams } from 'react-router-dom';
import ProfileFirstFilerItem from "./ProfileItemsUiCPN/ProfileFirstFilerItem";
import ProfileSecFilterItem from "./ProfileItemsUiCPN/ProfileSecFilterItem";
import ItemsGrid from "./ProfileItemsUiCPN/ScreenTwo/CardCPN/Mansory/ItemsGrid";

const ProfileItemsUI = () => {
  const { walletaddress } = useParams();

  // Show items for the wallet address in URL (can be any user, not just logged-in user)
  if (!walletaddress) {
    return null;
  }
  return (
    <div className="overflow-y-auto">
      <div className="flex flex-col gap-3 ">
        <ProfileFirstFilerItem />
        <ProfileSecFilterItem />
      </div>
      <div className="mt-6">
        <ItemsGrid walletaddress={walletaddress as string} />
      </div>
    </div>
  );
};

export default ProfileItemsUI;