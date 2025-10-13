
import React, { useState, useEffect } from 'react';
import HeaderEditProfileSide from "./EditSideSettingCPN/HeaderEditProfileSide"
import FormEditProfileSide from "./EditSideSettingCPN/FormEditProfileSide"
import FormFooterSaveSlide from "./EditSideSettingCPN/FormFooterSaveSlide"
import { useAuth } from '../../../../Auth/AuthContext';

const EditProfileSideSettingUI = () => {
  const { username, bio, website, updateProfile, address, token } = useAuth();
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
      const response = await fetch('/api/user/profile', {
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
        updateProfile(formUsername, formBio, formWebsite);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[#091111] w-[128vh] h-[83vh]  rounded-sm border-[#181C14] border overflow-y-scroll overflow-x-hidden flex flex-col">
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
