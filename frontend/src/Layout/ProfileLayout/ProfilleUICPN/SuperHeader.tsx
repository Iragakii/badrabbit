import Header from "../../../components/Header/Header";
import ProfileCreatedUI from "../ProfileCreatedUI.tsx/ProfileCreatedUI";
import ProfileItemsUI from "../ProfileItemsUI/ProfileItemsUI";
import NavContainer from "./ProfileNav/NavContainer";
import SecSuperHeader from "./SecSuperHeader";
import ModalItemDetail from "../../../Modal/ModalItemDetail/ModalItemDetail";
import { useLocation } from "react-router-dom";

const SuperHeader = () => {
  const location = useLocation();
  const isCreated = location.pathname.endsWith('/created');
  const isCreating = location.pathname.endsWith('/creating');
  
  const showProfileUI = isCreated || isCreating;
  const isItems = location.pathname.endsWith('/items');
  
  // Check if we're on an item detail page
  const isItemDetail = location.pathname.includes('/item/');
  
  const handleCloseModal = () => {
    // Modal handles its own navigation
  };
  
  return (
    <>
      <div className="space-y-6 bg-[#0C0C0C] text-white">
        <Header />

        <div className="space-y-4">
          <SecSuperHeader />
          <NavContainer />
        </div>
      </div>
      {/* Content components rendered outside fixed header for scrolling */}
      {isItems && !isItemDetail && (
        <div className="bg-[#0C0C0C]">
          <ProfileItemsUI />
        </div>
      )}
      {showProfileUI && (
        <div className="bg-[#0C0C0C]">
          <ProfileCreatedUI />
        </div>
      )}
      {/* Item Detail Modal */}
      {isItemDetail && (
        <ModalItemDetail onClose={handleCloseModal} />
      )}
    </>
  );
};

export default SuperHeader;