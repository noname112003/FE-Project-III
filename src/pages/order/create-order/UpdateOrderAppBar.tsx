import {useNavigate} from "react-router-dom";
import {useRef} from "react";
import {useReactToPrint} from "react-to-print";
import MainAppBar from "../../../components/layout/MainAppBar.tsx";
import {Box, Button} from "@mui/material";
import {ReceiptToPrint} from "./Receipt.tsx";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";

type Props = {
}

export default function UpdateOrderAppBar({  }: Props) {

    const navigate = useNavigate();
    const receiptRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => receiptRef.current,
    });

    return (
        <MainAppBar>
            <Box flex={1} display="flex" justifyContent="space-between" alignItems="center">
                <Button variant="text" sx={{ color: '#637381' }} onClick={() => navigate(-1)}><KeyboardArrowLeft /> Quay lại danh sách đơn hàng</Button>
            </Box>
        </MainAppBar>
    )
}