import CreateColle from "../ProfileCreatedUI.tsx/CreateColle";
import DefaultImgCreatedUI from "../ProfileCreatedUI.tsx/DefaultImgCreatedUI";
import TitleaDesCreatedUI from "../ProfileCreatedUI.tsx/TitleaDesCreatedUI";

const CreatingUI = () => {
  return (
    <div className="w-full h-150">
      <div className="flex flex-col items-center justify-center space-y-8 h-full">
        <DefaultImgCreatedUI />
        <TitleaDesCreatedUI/>
        <CreateColle />
      </div>
    </div>
  );
};

export default CreatingUI;