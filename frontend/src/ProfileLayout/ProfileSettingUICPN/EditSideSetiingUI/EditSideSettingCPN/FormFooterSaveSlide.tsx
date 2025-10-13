
import React from 'react';

type FormFooterSaveSlideProps = {
  onSave: () => void;
  isLoading: boolean;
};

const FormFooterSaveSlide: React.FC<FormFooterSaveSlideProps> = ({ onSave, isLoading }) => {
  return (
    <>
     <div className='flex justify-end bg-[#091111] border-1 border-t-[#181C14] py-4 px-34'>
          <button
            onClick={onSave}
            disabled={isLoading}
            className={`bg-[#41A67E] p-2 px-5 text-white font-extrabold rounded cursor-pointer hover:bg-[#41A67E]/80 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
     </div>
    </>
  )
}

export default FormFooterSaveSlide
