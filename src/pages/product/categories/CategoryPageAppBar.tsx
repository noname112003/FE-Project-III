import { Box, Button } from "@mui/material";
import MainAppBar from "../../../components/layout/MainAppBar";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import { useNavigate } from "react-router-dom";
import AccountSection from "../AccountSection";

type Props = {};

export default function CategoryPageAppBar({}: Props) {
    const navigate = useNavigate();
    return (
        <MainAppBar>
            <Box sx={{ display: "flex",width: "100%",justifyContent:'space-between'}}>
                <Button
                    onClick={() => navigate("/products")}
                    variant="text"
                    startIcon={
                        <NavigateBefore
                            color="disabled"
                            sx={{ width: "30px", height: "30px" }}
                        />
                    }
                    sx={{
                        textTransform: "none",
                        color: "rgba(0,0,0,0.38)",
                        fontSize: "1rem",
                    }}
                >
                    Quay lại danh sách sản phẩm
                </Button>
                <AccountSection/>
            </Box>
        </MainAppBar>
    );
}
