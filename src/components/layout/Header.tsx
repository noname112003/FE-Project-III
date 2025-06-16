import {useEffect, useState} from "react";
import {Box, MenuItem, Select, Typography} from "@mui/material";
import MainAppBar from "./MainAppBar.tsx";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";


export default function Header() {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();
    const store = useSelector((state: any) => state.storeSetting.store);
    useEffect(() => {
        const user = localStorage.getItem('user');
        setUser(user ? JSON.parse(user) : null);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('stores');
        navigate('/login');
    }
    return (
        <MainAppBar>
            <Box display="flex" alignItems="center" justifyContent="space-between" flex={1}>
                {store && (
                    <Typography variant="h6" sx={{
                        color: '#000',
                        fontFamily: '"Segoe UI", sans-serif',
                        fontSize: '26px',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: 'normal',
                    }}>
                        {store.name}
                    </Typography>
                )}
                {user && <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ color: '#000', fontWeight: '600' }}>{user.name}</Typography>
                    <Select sx={{ '.MuiOutlinedInput-notchedOutline': { borderStyle: 'none' } }}>
                        <MenuItem onClick={() => navigate(`/account/${user.id}`)}>Thông tin tài khoản</MenuItem>
                        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                    </Select>
                </Box>}
            </Box>
        </MainAppBar>
    );
}
