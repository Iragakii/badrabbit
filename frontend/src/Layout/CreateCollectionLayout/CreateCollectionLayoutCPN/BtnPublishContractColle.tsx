import { useState } from 'react';

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
  const [uploading, setUploading] = useState(false);

  const uploadToIPFS = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await fetch('http://localhost:8081/api/collections/upload-image', {
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
      alert('Please fill in all required fields and select an image');
      return;
    }

    try {
      setUploading(true);

      // Upload image to IPFS
      const ipfsUrl = await uploadToIPFS(selectedFile);

      // Send to backend
      const response = await fetch('http://localhost:8081/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...collectionData,
          image: ipfsUrl,
        }),
      });

      if (response.ok) {
        alert('Collection created successfully!');
        // Redirect or reset form
      } else {
        alert('Failed to create collection');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating collection');
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
