import { Box, Button, Typography } from "@mui/material";
import MainAppBar from "../../../components/layout/MainAppBar";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import { useNavigate } from "react-router-dom";
import { deleteProduct } from "../../../services/productAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Close } from "@mui/icons-material";
import { useState } from "react";

type Props = {
    id?: string | undefined;
};

export default function ProductDetailAppBarV2({ id }: Props) {
    const navigate = useNavigate();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    function handleDeleteProduct() {
        deleteProduct(id)
            .then((_res) => {
                toast.success("Xoá sản phẩm thành công");
                navigate('/products');
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    }
    return (
        <MainAppBar>
            <Box
                sx={{
                    display: "flex",
                    flexGrow: 1,
                    justifyContent: "space-between",
                }}
            >
                <Button
                    onClick={() => navigate("/warehouse/products")}
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
                <Box sx={{ display: "flex", gap: "20px" }}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => setOpenDeleteDialog(true)}
                    >
                        Xóa
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/warehouse/products/${id}/edit`)}
                    >
                        Sửa sản phẩm
                    </Button>
                </Box>
                {openDeleteDialog ? (
                    <Box
                        sx={{
                            position: "fixed",
                            flexGrow: 2,
                            top: "0",
                            left: "0",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 10000,
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: "white",
                                width: "600px",
                                height: "auto",
                                padding: "10px 30px 30px 30px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                border: "1px solid black",
                                borderRadius: "5px",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: "10px 0",
                                    borderBottom: "1px solid #d9d9d9",
                                }}
                            >
                                <Typography variant="h5" sx={{ color: 'red' }}>
                                    Xóa sản phẩm
                                </Typography>
                                <Close color="disabled"/>
                            </Box>
                            <Typography sx={{ color: '#000' }}>
                                Thao tác này sẽ xóa sản phẩm bạn đã chọn. Thao
                                tác này không thể khôi phục.
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: "25px",
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => setOpenDeleteDialog(false)}
                                >
                                    Thoát
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleDeleteProduct}
                                >
                                    Xóa
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    <></>
                )}
            </Box>
        </MainAppBar>
    );
}
