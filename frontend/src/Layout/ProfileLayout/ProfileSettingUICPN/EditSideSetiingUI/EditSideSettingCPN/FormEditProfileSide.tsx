import { useAuth } from "../../../../../../Auth/AuthContext";
import ButtonConnectX from "./ButtonConnectX";
import ButtonDisconectX from "./ButtonDisconectX";



interface FormProps {
  username: string;
  onUsernameChange: (value: string) => void;
  bio: string;
  onBioChange: (value: string) => void;
  website: string;
  onWebsiteChange: (value: string) => void;
}

const FormEditProfileSide: React.FC<FormProps> = ({

  username,
  onUsernameChange,
  bio,
  onBioChange,
  website,
  onWebsiteChange
}) => {
  const { address, twitter } = useAuth();
  return (
    <div className="w-180 h-155  text-gray-200 rounded-xl p-6 space-y-6 ">
      <form className="space-y-5">
        {/* Username */}
        <div>
          <label className="block text-[16px] font-medium mb-1 text-white">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            className="w-full  border border-gray-700 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            This is your public username.
          </p>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-[16px] font-medium mb-1 text-white">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            className="w-full  border border-gray-700 rounded-md px-3 py-3 pb-4 focus:outline-none focus:ring-2 focus:ring-gray-500"
            rows={2}
          ></textarea>
        </div>

        {/* URL */}
        <div>
          <label className="block text-[16px] font-medium mb-1 text-white">
            URL
          </label>
          <input
            type="url"
            placeholder="Add a URL"
            value={website}
            onChange={(e) => onWebsiteChange(e.target.value)}
            className="w-full  border border-gray-700 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Add a link to your website or social profile.
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-[16px] font-medium mb-1 text-white">
            Email Address
          </label>
          <div className="flex items-center gap-2">
            <input
              type="email"
              disabled
           
              className="flex-1  border border-gray-700 rounded-md px-3 py-3 text-gray-400 cursor-not-allowed"
            />
            <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-2 py-[7px] rounded">
              UNVERIFIED
            </span>
            <button
              type="button"
              className="text-[16px] text-white hover:text-white border border-gray-700 px-3 py-1 rounded-md cursor-pointer hover:bg-[#181818]"
            >
              Edit
            </button>
          </div>
          <button
            type="button"
            className="mt-2 text-[16px] text-white border border-gray-700 px-3 py-1 rounded-md hover:bg-[#181818] transition cursor-pointer"
          >
            Resend verification email
          </button>
        </div>

        {/* Social Connections */}
        <div>
          <label className="block text-[16px] font-medium mb-1 text-white">
            Social Connections
          </label>
          <div className="flex items-center justify-between  border border-gray-700 rounded-md px-3 py-2">
            <div className="flex items-center gap-2">
              <img src="/settingprofile/x.jpg" alt="" className="w-6 h-6  border border-gray-700 rounded-[7px]"/>
              <span>{twitter ? `@${twitter}` : "Connect X"}</span>
            </div>
             {twitter ? <ButtonDisconectX /> : <ButtonConnectX />}
          </div>
        </div>
       
      </form>
      
    </div>
  );
};

export default FormEditProfileSide;
