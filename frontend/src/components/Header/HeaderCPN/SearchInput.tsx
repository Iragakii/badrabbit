import Input from "@mui/material/Input";
import { styled } from "@mui/material/styles";

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
  return (
    <StyledInput
      placeholder="Search Opensea"
      inputProps={{
        style: { padding: "0 12px" },
      }}
      className="h-10 w-full max-w-64 text-base  focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
      disableUnderline={true}
    />
  );
}
