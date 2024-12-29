import { Box, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

export default function AccountSection({}: Props) {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    useEffect(() => {
        const user = localStorage.getItem("user");
        setUser(user ? JSON.parse(user) : null);
    }, []);

    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ color: "#000", fontWeight: "600" }}>
                {user?.name}
            </Typography>
            <Select
                sx={{
                    ".MuiOutlinedInput-notchedOutline": { borderStyle: "none" },
                }}
            >
                <MenuItem onClick={() => navigate(`/account/${user.id}`)}>
                    Quản lý tài khoản
                </MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </Select>
        </Box>
    );
}
