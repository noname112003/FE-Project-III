import React from "react";
import { Box } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import { ToastContainer } from "react-toastify";

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
            <ToastContainer hideProgressBar autoClose={3000} />
        </Box>
    );
}
