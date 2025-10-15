import CreateColle from "./CreateColle";
import DefaultImgCreatedUI from "./DefaultImgCreatedUI";
import TitleaDesCreatedUI from "./TitleaDesCreatedUI";

const ProfileCreatedUI = () => {
  return (
    <>
      <div className=" w-full h-150 flex items-center justify-center">
        <div className="space-y-8">
            <DefaultImgCreatedUI></DefaultImgCreatedUI>
            <TitleaDesCreatedUI></TitleaDesCreatedUI>
            <CreateColle></CreateColle>
        </div>
      </div>
    </>
  );
};

export default ProfileCreatedUI;
