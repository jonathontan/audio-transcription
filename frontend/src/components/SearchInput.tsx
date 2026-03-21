import { Button, Input } from "@mui/material";
import { useState, type Dispatch, type SetStateAction } from "react";
import colors from "../styles/colors";
import styles from "./SearchInput.module.css";

interface Props {
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
  onSearch: () => void;
}

function SearchInput({ onSearch, searchText, setSearchText }: Readonly<Props>) {
  const [text, setText] = useState<string>(searchText);

  const handleClick = () => {
    onSearch();
    setText("");
  };

  return (
    <Input
      id="searchTranscription"
      fullWidth
      disableUnderline
      type="search"
      value={text}
      placeholder="Search..."
      onChange={(e) => {
        setText(e.target.value.trim());
        setSearchText(e.target.value.trim());
      }}
      sx={{
        border: "1px solid",
        borderColor: "rgba(0, 0, 0, 0.25)",
        borderRadius: "10px",
        padding: "0 10px",
      }}
      endAdornment={
        <Button
          variant="text"
          className={styles.button}
          onClick={handleClick}
          sx={{
            display: searchText === "" ? "none" : "block",
            color: colors.secondary,
          }}
        >
          Search
        </Button>
      }
    />
  );
}

export default SearchInput;
