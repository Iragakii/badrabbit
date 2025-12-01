


import { useAuth } from '../../../../../Auth/AuthContext';
import { normalizeImageUrl } from '../../../../config/api';


const UserAvaWhenLog = () => {
  const { avatarUrl } = useAuth();
  const normalizedAvatar = normalizeImageUrl(avatarUrl);

  return (
    <>
        <button className="w-full h-full cursor-pointer">
          <img
      src={normalizedAvatar || "/defaultava.png"}
      alt="Token Avatar"
      className="w-full h-full rounded-full object-cover "
      onError={(e) => {
        // Fallback to default if image fails to load
        if (e.currentTarget.src !== "/defaultava.png") {
          e.currentTarget.src = "/defaultava.png";
        }
      }}
    />
        </button>
      </>
  );
};

export default UserAvaWhenLog;
