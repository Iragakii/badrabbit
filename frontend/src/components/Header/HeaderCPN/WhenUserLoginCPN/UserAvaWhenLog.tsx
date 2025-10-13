


import { useAuth } from '../../../../../Auth/AuthContext';

const UserAvaWhenLog = () => {
  const { avatarUrl } = useAuth();

  return (
    <>
        <button className=" cursor-pointer">
          <img
      src={avatarUrl || "/defaultava.png"}
      alt="Token Avatar"
      className="w-full h-full rounded-full object-cover "
    />
        </button>
      </>
  );
};

export default UserAvaWhenLog;
