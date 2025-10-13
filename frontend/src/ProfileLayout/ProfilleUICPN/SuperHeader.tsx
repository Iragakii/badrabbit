import Header from "../../components/Header/Header";
import SecSuperHeader from "./SecSuperHeader";

const SuperHeader = () => {
  return (
    <>
      <div className="space-y-18 fixed top-0 left-0 right-0 bg-[#0C0C0C] text-white py-2 z-50 ">
        
          <div>
            <Header></Header>
          </div>
          <SecSuperHeader></SecSuperHeader>
      
      </div>
    </>
  );
};

export default SuperHeader;
