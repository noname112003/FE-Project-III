import { Box, InputBase } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useState } from "react";

type Props = {
    onKeyPress: React.Dispatch<React.SetStateAction<string>>;
    placeHolder: string;
};

export default function SearchField({ onKeyPress, placeHolder }: Props) {
    const [searchQuery, setSearchQuery] = useState("");

    function handleEnterPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            onKeyPress(searchQuery);
        }
    }

    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchQuery(e.target.value);
        onKeyPress(e.target.value);
    }

    return (
        <Box>
            <Box
                sx={{
                    border: "1px solid #d9d9d9",
                    alignItems: "center",
                    display: "flex",
                    borderRadius: "5px",
                    padding: "10px 15px",
                    gap: "30px",
                }}
            >
                <Search
                    sx={{
                        color: "#d9d9d9",
                        height: "32px",
                        width: "32px",
                    }}
                />
                <InputBase
                    onChange={handleSearchChange}
                    value={searchQuery}
                    onKeyDown={handleEnterPress}
                    sx={{ width: "100%" }}
                    placeholder={placeHolder}
                />
            </Box>
        </Box>
    );
}
