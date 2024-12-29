import { Box, Button, CircularProgress, Typography } from "@mui/material"
import MainAppBar from "../../../components/layout/MainAppBar"
import { useNavigate } from "react-router-dom"

type Props = {
  handleCreateOrder: () => void,
  doesCreatingOrder: boolean
}

export default function CreateOrderAppBar({ handleCreateOrder, doesCreatingOrder }: Props) {

  const navigate = useNavigate();

  return (
    <MainAppBar>
      <Box display="flex" flexGrow={1} justifyContent="space-between" alignItems="center">
        <Typography variant="body1" sx={{ color: '#747C87', fontWeight: '600' }}>Tạo đơn hàng</Typography>
        <Box>
          <Button sx={{ marginRight: '25px' }} variant="outlined" onClick={() => navigate('/orders')}>Thoát</Button>
          {!doesCreatingOrder ? <Button onClick={handleCreateOrder} variant="contained">Tạo đơn hàng</Button> : <Button  variant="contained"><CircularProgress size={24} color="inherit"/></Button>}
        </Box>
      </Box>
    </MainAppBar>
  )
}