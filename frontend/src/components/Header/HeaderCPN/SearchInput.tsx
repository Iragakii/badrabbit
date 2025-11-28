import { useState } from "react";
import Input from "@mui/material/Input";
import { styled } from "@mui/material/styles";
import ModalSearch from "../../../Modal/ModalSearch/ModalSearch";

// Create a styled Input component to override MUI defaults
const StyledInput = styled(Input)({
  "& .MuiInputBase-input": {
    color: "#84d018ff", // equivalent to text-gray-900
  },
  "&::placeholder": {
    color: "#18b956ff", // equivalent to text-gray-400
    opacity: 1,
  },
});

export default function SearchInput() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFocus = () => {
    setIsSearchOpen(true);
  };

  const handleClick = () => {
    setIsSearchOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!isSearchOpen) {
      setIsSearchOpen(true);
    }
  };

  return (
    <>
      <div onClick={handleClick} className="flex-1">
        <StyledInput
          placeholder="Search OpenSea"
          value={searchQuery}
          onChange={handleChange}
          onFocus={handleFocus}
          onClick={handleClick}
          inputProps={{
            style: { padding: "0 12px" },
          }}
          className="h-10 w-full max-w-64 text-base  focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800 cursor-pointer"
          disableUnderline={true}
        />
      </div>
      <ModalSearch
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery("");
        }}
        initialQuery={searchQuery}
      />
    </>
  );
}
