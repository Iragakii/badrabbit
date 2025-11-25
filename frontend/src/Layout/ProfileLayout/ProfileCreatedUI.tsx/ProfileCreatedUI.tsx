import { useLocation } from "react-router-dom";
import CreatedCollections from "./CreatedCollections";
import CreatingUI from "../ProfileCreatingUI.tsx/CreatingUI";


const ProfileCreatedUI = () => {
  const location = useLocation();
  const isCreating = location.pathname.endsWith('/creating');
  const isCreated = location.pathname.endsWith('/created');

  if (isCreating) {
    return <CreatingUI />;
  }

  if (isCreated) {
    return <CreatedCollections />;
  }

  return null;
};

export default ProfileCreatedUI;