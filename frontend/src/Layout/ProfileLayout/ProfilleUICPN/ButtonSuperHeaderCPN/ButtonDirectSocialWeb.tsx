import { useAuth } from "../../../../../Auth/AuthContext";


const ButtonDirectSocialWeb = () => {
  const { website } = useAuth();
  return (
    <>
      <div>
        <a href={website || "#"} target="_blank" rel="noopener noreferrer">
          <button className="cursor-pointer hover:scale-120 transition">
            <img
              src="/public/settingprofile/moon.svg"
              alt=""
              className="w-8 h-8"
            />
          </button>
        </a>
      </div>
    </>
  );
};

export default ButtonDirectSocialWeb;
