import React from "react";
import { Box } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";

type Props = {
    children: React.ReactNode;
};

export default function MainBox({ children }: Props) {
    return (
        <Box
            component="main"
            sx={{ backgroundColor: "#F0F1F1", height: "100%", fontFamily: "Arial" }}
        >
            <Toolbar />
            {children}
            {/*<ToastContainer hideProgressBar autoClose={3000} />*/}
        </Box>
    );
}
