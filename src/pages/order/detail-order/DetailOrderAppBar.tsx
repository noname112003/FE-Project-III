import { Box, Button } from "@mui/material"
import MainAppBar from "../../../components/layout/MainAppBar"
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from "react-router-dom";
import { ReceiptToPrint } from "../create-order/Receipt";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

type Props = {
  order: any;
}

export default function DetailOrderAppBar({ order }: Props) {

  const navigate = useNavigate();
  const receiptRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });

  return (
    <MainAppBar>
      {order && <Box display="none">
        <ReceiptToPrint order={order} ref={receiptRef}/>
      </Box>}
      <Box flex={1} display="flex" justifyContent="space-between" alignItems="center">
        <Button variant="text" sx={{ color: '#637381' }} onClick={() => navigate(-1)}><KeyboardArrowLeft /> Quay lại danh sách đơn hàng</Button>
        {order && <Button variant="outlined" sx={{ ml: 2 }} onClick={handlePrint}>In hóa đơn</Button>}
      </Box>
    </MainAppBar>
  )
}