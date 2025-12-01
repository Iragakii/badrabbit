
import  { useState, useEffect } from 'react';
import HeaderEditProfileSide from "./EditSideSettingCPN/HeaderEditProfileSide"
import FormEditProfileSide from "./EditSideSettingCPN/FormEditProfileSide"
import FormFooterSaveSlide from "./EditSideSettingCPN/FormFooterSaveSlide"
import { useAuth } from '../../../../../Auth/AuthContext';import { useNotification } from '../../../../components/Notification/NotificationContext';
import { getApiUrl } from '../../../../config/api';

const EditProfileSideSettingUI = () => {
  const { username, bio, website, updateProfile, address, token } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [formUsername, setFormUsername] = useState(username || '');
  const [formBio, setFormBio] = useState(bio || '');
  const [formWebsite, setFormWebsite] = useState(website || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormUsername(username || '');
    setFormBio(bio || '');
    setFormWebsite(website || '');
  }, [username, bio, website]);

  const handleSave = async () => {
    if (!address || !token) return;

    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl('api/user/profile'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address,
          username: formUsername,
          bio: formBio,
          website: formWebsite,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        updateProfile(formUsername, formBio, formWebsite);
        showSuccess('Profile updated successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to update profile:', errorData);
        showError(`Failed to update profile: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showError(`Error updating profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[#091111] w-[128vh] h-[83vh]  rounded-sm border-[#181C14] border overflow-y-scroll overflow-x-hidden flex flex-col modal-scrollbar">
              <div className="!w-[128vh] flex flex-col items-center justify-center mt-7 flex-grow">
                <HeaderEditProfileSide></HeaderEditProfileSide>
                 <FormEditProfileSide
                   username={formUsername}
                   onUsernameChange={setFormUsername}
                   bio={formBio}
                   onBioChange={setFormBio}
                   website={formWebsite}
                   onWebsiteChange={setFormWebsite}
                 />
              </div>
               <div className="sticky bottom-0 z-10">
                <FormFooterSaveSlide onSave={handleSave} isLoading={isLoading} />
               </div>
      </div>
    </>
  )
}

export default EditProfileSideSettingUI
