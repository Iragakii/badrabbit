import React, { useState } from 'react';
import FooterCreateColle from "./CreateCollectionLayoutCPN/FooterCreateColle"
import HeaderCreateColle from "./CreateCollectionLayoutCPN/HeaderCreateColle"
import MainCreateCollec from "./CreateCollectionLayoutCPN/MainCreateCollec"


const CreateCollectionLayout = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [collectionData, setCollectionData] = useState({
    name: '',
    description: '',
    chain: 'Ethereum',
    type: 'ERC721',
    ownerWallet: '0x4eb93d214e037926165b9d689818e609d4efe6c4', // Mock wallet address for testing
  });

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
