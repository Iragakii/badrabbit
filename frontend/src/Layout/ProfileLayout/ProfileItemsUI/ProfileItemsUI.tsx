import ProfileFirstFilerItem from "./ProfileItemsUiCPN/ProfileFirstFilerItem";
import ProfileSecFilterItem from "./ProfileItemsUiCPN/ProfileSecFilterItem";
import ItemsGrid from "./ProfileItemsUiCPN/ScreenTwo/CardCPN/Mansory/ItemsGrid";

const ProfileItemsUI = () => {
  return (
    <>
      <div className="flex flex-col gap-3">
        <ProfileFirstFilerItem />
        <ProfileSecFilterItem />
      </div>

      <div className="mt-6">
        <ItemsGrid />
      </div>
    </>
  );
};

export default ProfileItemsUI;
