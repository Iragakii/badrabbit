
import TopSlideLogForm from "./TopSlideLogForm";
import LinkWallletButton from "../../../../LinkWalletButton/LinkWallletButton";
import FourSlideLogForm from "./FourSlideLogForm";

import LastSlideLogForm from "./LastSlideLogForm";
import SecondSlideLogForm from "./SecondSlideLogForm";

const SlideLoginFormContainer = () => {
  return (
    <>
      <div className="bg-[#0C0C0C] w-50 text-white  px-0 rounded-md border-[#181C14] border shadow-lg flex-grid ">
        <div> <TopSlideLogForm></TopSlideLogForm></div>
        <div className="px-3 py-0 hover:bg-[#509488] items-center flex rounded-t"> <SecondSlideLogForm></SecondSlideLogForm> </div>
        <div className="px-3 py-2 hover:bg-[#509488]"> <LinkWallletButton></LinkWallletButton> </div>
        <div className="px-3 py-3 hover:bg-[#509488] border-t border-[#181C14] border-b"> <FourSlideLogForm></FourSlideLogForm> </div>
        <div className="px-3 py-3 hover:bg-[#509488] rounded-t-none rounded rounded-b-[#509488]"> <LastSlideLogForm></LastSlideLogForm></div>
      </div>
    </>
  );
};

export default SlideLoginFormContainer;
