import { Typography, Box, Select, MenuItem } from '@mui/material'
import MainAppBar from '../../../components/layout/MainAppBar'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {}

export default function OrderListAppBar({ }: Props) {

  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  useEffect(() => {
    const user = localStorage.getItem('user');
    setUser(user ? JSON.parse(user) : null);
  }, []);

  return (
    user && <MainAppBar>
      <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ color: '#000', fontWeight: '600' }}>Danh sách đơn hàng</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: '#000', fontWeight: '600' }}>{user.name}</Typography>
          <Select sx={{ '.MuiOutlinedInput-notchedOutline': { borderStyle: 'none' } }}>
            <MenuItem onClick={() => navigate(`/account/${user.id}`)}>Thông tin tài khoản</MenuItem>
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Select>
        </Box>
      </Box>
    </MainAppBar>
  )
}