import { useState } from "react";

interface ButtonUploadImgProps {
  onFileSelect: (file: File | null) => void;
}

const ButtonUploadImg = ({ onFileSelect }: ButtonUploadImgProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      <label className="cursor-pointer">
        <div className="w-full h-[400px] border-dashed border-2 bg-[#19191a] rounded-[8px] border-[#2C2C2C] flex flex-col items-center justify-center hover:border-[#696FC7] transition-colors">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-[8px]"
            />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <img
                src="/public/createdui/upload-i.svg"
                alt="Upload"
                className="w-16 h-16 opacity-50"
              />
              <span className="text-gray-400 text-[14px]">
                Click to upload or drag and drop
              </span>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      {preview && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPreview(null);
            onFileSelect(null);
          }}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-[4px] w-5 h-5 flex items-center justify-center hover:bg-red-600"
        >
            <img
                src="/public/createdui/close.svg"
                alt="Upload"
                className="w-3 h-3 opacity-50"
              />
        </button>
      )}
    </div>
  );
};

export default ButtonUploadImg;

