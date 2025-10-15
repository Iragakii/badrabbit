
import Header from "../../../components/Header/Header";
import ProfileCreatedUI from "../ProfileCreatedUI.tsx/ProfileCreatedUI";
import NavContainer from "./ProfileNav/NavContainer";
import SecSuperHeader from "./SecSuperHeader";
import { useLocation } from "react-router-dom";

const SuperHeader = () => {
  const location = useLocation();
  const isCreated = location.pathname.endsWith('/created');

  return (
    <>
      <div className="space-y-6 fixed top-0 left-0 right-0 bg-[#0C0C0C] text-white  z-20 ">


            <Header></Header>



      <div className="space-y-4">      <SecSuperHeader></SecSuperHeader>
          <NavContainer></NavContainer>
        </div>
        {isCreated && (
          <div className="">
            <ProfileCreatedUI></ProfileCreatedUI>
          </div>
        )}
      </div>
    </>
  );
};

export default SuperHeader;
