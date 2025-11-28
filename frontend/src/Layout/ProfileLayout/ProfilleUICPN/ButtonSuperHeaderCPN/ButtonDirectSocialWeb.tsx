import { useAuth } from "../../../../../Auth/AuthContext";


const ButtonDirectSocialWeb = () => {
  const { website, twitter } = useAuth();
  const hrefLink = twitter ? `https://twitter.com/${twitter}` : (website || "#");
  return (
    <>
      <div>
        <a href={hrefLink} target="_blank" rel="noopener noreferrer">
          <button className="cursor-pointer hover:scale-120 transition">
            <img
              src="/settingprofile/moon.svg"
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
