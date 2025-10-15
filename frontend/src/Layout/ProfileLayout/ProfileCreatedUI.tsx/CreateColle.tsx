import { useState } from "react";
import ModalCreateCollection from "../../../Modal/ModalCreateCollection/ModalCreateCollection";


const CreateColle = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-white bg-[#1C352D] px-4 py-3 text-[14px] border-[#181C14] hover:bg-[#181818] rounded-[7px] font-extrabold cursor-pointer"
        >
          Create a collection
        </button>
      </div>
      {isModalOpen && <ModalCreateCollection   onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default CreateColle