import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../Auth/AuthContext';
import FooterCreateColle from "./CreateCollectionLayoutCPN/FooterCreateColle"
import HeaderCreateColle from "./CreateCollectionLayoutCPN/HeaderCreateColle"
import MainCreateCollec from "./CreateCollectionLayoutCPN/MainCreateCollec"


const CreateCollectionLayout = () => {
  const { address } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [collectionData, setCollectionData] = useState({
    name: '',
    description: '',
    chain: 'Ethereum',
    type: 'ERC721',
    ownerWallet: address || '',
  });

  // Update ownerWallet when address changes
  useEffect(() => {
    if (address) {
      setCollectionData(prev => ({ ...prev, ownerWallet: address }));
    }
  }, [address]);

  return (
    <>
      <div className="bg-[#0C0C0C] h-screen  ">
          <HeaderCreateColle></HeaderCreateColle>
          <MainCreateCollec onFileSelect={setSelectedFile} onDataChange={setCollectionData} initialData={collectionData}></MainCreateCollec>
          <FooterCreateColle selectedFile={selectedFile} collectionData={collectionData}></FooterCreateColle>
      </div>
    </>
  )
}

export default CreateCollectionLayout
