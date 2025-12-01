import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../../config/api';
import { useNotification } from '../../../components/Notification/NotificationContext';
import { useAuth } from '../../../../Auth/AuthContext';

const BtnPublishContractColle = ({ selectedFile, collectionData }: {
  selectedFile: File | null;
  collectionData: {
    name: string;
    description: string;
    chain: string;
    type: string;
    ownerWallet: string;
  }
}) => {
  const { showSuccess, showError, showWarning } = useNotification();
  const { address } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const uploadToIPFS = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await fetch(getApiUrl('api/collections/upload-image'), {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Upload response:', errorText);
      throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    const uploadResult = await uploadResponse.json();
    console.log('Upload result:', uploadResult);
    return uploadResult.ipfsUrl;
  };

  const handlePublish = async () => {
    if (!selectedFile || !collectionData.name || !collectionData.ownerWallet) {
      showWarning('Please fill in all required fields and select an image');
      return;
    }

    try {
      setUploading(true);

      // Upload image to IPFS
      const ipfsUrl = await uploadToIPFS(selectedFile);

      // Send to backend
      const requestBody = {
        ...collectionData,
        image: ipfsUrl,
      };
      
      console.log('Sending collection data:', requestBody);
      
      const response = await fetch(getApiUrl('api/collections'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', responseData);

      if (response.ok) {
        showSuccess('Collection created successfully!');
        // Navigate to created collections page to see the new collection
        if (address) {
          navigate(`/${address}/created`, { replace: false });
        } else if (collectionData.ownerWallet) {
          navigate(`/${collectionData.ownerWallet}/created`, { replace: false });
        }
      } else {
        const errorMessage = responseData?.error || `Failed to create collection: ${response.status} ${response.statusText}`;
        console.error('Collection creation failed:', errorMessage);
        showError(errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Error creating collection');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
       <button
         onClick={handlePublish}
         disabled={uploading}
         className="text-white font-[600] bg-blue-500 hover:bg-blue-400 transition duration-300 p-3 py-2 rounded-[8px] cursor-pointer disabled:opacity-50"
       >
         {uploading ? 'Publishing...' : 'Publish Contract'}
       </button>
    </>
  )
}

export default BtnPublishContractColle
