import { useRef } from 'react';
import { useAuth } from '../../../../../../Auth/AuthContext';
import UserAvaWhenLog from '../../../../../components/Header/HeaderCPN/WhenUserLoginCPN/UserAvaWhenLog';
import { getApiUrl } from '../../../../../config/api';
import { useNotification } from '../../../../../components/Notification/NotificationContext';


const HeaderEditProfileSide = () => {
  const { address, updateAvatar } = useAuth();
  const { showSuccess, showError } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !address) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('address', address);

    try {
      const response = await fetch(getApiUrl('api/user/avatar'), {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Backend returns User object with profileImageUrl field
        if (data.profileImageUrl) {
          updateAvatar(data.profileImageUrl);
          showSuccess('Avatar uploaded successfully!');
        } else {
          console.error('Avatar URL not found in response:', data);
          showError('Avatar upload failed: Invalid response');
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to upload avatar:', errorData);
        showError('Failed to upload avatar. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  return (
    <>
      <div className="">
       <button className="w-180 h-90 relative">
  <img
    src="/tokentestava.jpg"
    alt=""
    className="w-full h-full [mask-image:linear-gradient(to_bottom,black,black_calc(100%_-_theme(spacing.16)),transparent)] backdrop-blur-3xl opacity-50 hover:opacity-100 cursor-pointer transition duration-300 ease-in-out"
  />
  <div className="flex gap-3 fill-white -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 cursor-pointer">
    <div className="font-bold text-xl bg-gradient-to-r from-[#FFFD8F] via-[#FFF176] to-[#FBF3D1] bg-clip-text text-transparent">
      Edit Profile
    </div>
    <img src="/brush.svg" alt="" className="w-6 h-6" />
  </div>
</button>

          <div className="relative w-18 bottom-10 ml-6 cursor-pointer" onClick={handleUploadClick}>
          <div className="!w-17 !h-17 rounded-full  backdrop-blur-3xl opacity-50 hover:opacity-100 cursor-pointer transition duration-300 ease-in-out">
              <UserAvaWhenLog></UserAvaWhenLog>
         </div>
           <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
             <img src="/brush.svg" alt=""  className="h-6 w-6"/>
           </div>

         </div>
         <input
           type="file"
           ref={fileInputRef}
           onChange={handleFileChange}
           accept="image/*"
           style={{ display: 'none' }}
         />

      </div>
    </>
  );
};

export default HeaderEditProfileSide;
