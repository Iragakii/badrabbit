import EditProfileSideSettingUI from "./EditSideSetiingUI/EditProfileSideSettingUI"
import OptionSideSetting from "./OptionSideSetting/OptionSideSetting"


const ChildTwoSideSetting = () => {
  return (
    <>
        <div className="flex h-[82vh] gap-4">
                   <OptionSideSetting></OptionSideSetting>
          <EditProfileSideSettingUI></EditProfileSideSettingUI>
   
        </div>
        </>
  )
}

export default ChildTwoSideSetting