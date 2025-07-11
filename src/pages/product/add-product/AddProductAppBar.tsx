import { Box, Button } from "@mui/material";
import MainAppBar from "../../../components/layout/MainAppBar";

import { useNavigate } from "react-router-dom";


type Props = {
    submit: () => void;
};

export default function AddProductAppBar({ submit }: Props) {
    const navigate = useNavigate();
    return (
        <MainAppBar>
            <Box
                sx={{
                    display: "flex",
                    flexGrow: "1",
                    justifyContent: "space-between",
                }}
            >
                <Button
                    onClick={() => navigate("/products")}
                    variant="text"
                    sx={{
                        textTransform: "none",
                        color: "#000",
                        fontSize: "20px",
                    }}
                >
                    Thêm sản phẩm
                </Button>
                {/*<Box*/}
                {/*    sx={{*/}
                {/*        display: "flex",*/}
                {/*        alignItems: "center",*/}
                {/*        color: "#000",*/}
                {/*        fontSize: "26px", fontWeight: "600"*/}
                {/*    }}*/}
                {/*    className="titleHeader"*/}
                {/*>*/}
                {/*    Thêm sản phẩm*/}
                {/*</Box>*/}
                <Box sx={{ display: "flex", gap: "20px" }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate("/warehouse/products")}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={submit}
                    >
                        Lưu
                    </Button>
                </Box>
            </Box>
        </MainAppBar>
    );
}
