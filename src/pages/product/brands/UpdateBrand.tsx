import { Typography, Box, TextField, Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useState } from "react";
import { BrandRequest, BrandResponse } from "../../../models/ProductInterface";
import "react-toastify/dist/ReactToastify.css";
import { deleteBrand, updateBrand } from "../../../services/brandAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
    setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    selectedBrand: BrandResponse;
    onUpdate: () => void;
};

export default function UpdateBrand({
    setIsUpdate,
    selectedBrand,
    onUpdate,
}: Props) {
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [form, setForm] = useState<BrandRequest>({ ...selectedBrand });
    function handleFormChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    function handleUpdateBrand() {
        updateBrand(form.id, form)
            .then((_res) => {
                toast.success("Cập nhật nhãn hiệu thành công");
                onUpdate();
                setIsUpdate(false);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    }

    function handleDeleteBrand() {
        deleteBrand(form.id)
            .then((_res) => {
                toast.success("Xóa nhãn hiệu thành công");
                onUpdate();
                setIsUpdate(false);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    }

    return (
        <Box
            sx={{
                position: "fixed",
                flexGrow: "2",
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
            {!openConfirmDialog ? (
                <Box
                    sx={{
                        backgroundColor: "white",
                        width: "600px",
                        height: "auto",
                        padding: "10px 30px 30px 30px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px",
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
                        <Typography variant="h5">Cập nhật nhãn hiệu</Typography>

                        <Close color="disabled" />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            gap: "20px",
                        }}
                    >
                        <Box sx={{ width: "50%" }}>
                            <Typography
                                sx={{ color: "#000", fontSize: "0.9rem" }}
                            >
                                Tên nhãn hiệu
                                <span style={{ color: "#FF4D4D" }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                value={form.name}
                                required={true}
                                name="name"
                                size="small"
                                onChange={handleFormChange}
                            />
                        </Box>
                        <Box sx={{ width: "50%" }}>
                            <Typography
                                sx={{ color: "#000", fontSize: "0.9rem" }}
                            >
                                Mã nhãn hiệu
                            </Typography>
                            <TextField
                                fullWidth
                                name="code"
                                value={form.code}
                                size="small"
                                onChange={handleFormChange}
                            />
                        </Box>
                    </Box>
                    <Box>
                        <Typography sx={{ color: "#000", fontSize: "0.9rem" }}>
                            Ghi chú
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            name="description"
                            value={form.description}
                            rows={4}
                            onChange={handleFormChange}
                        />
                    </Box>

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
                            onClick={() => setOpenConfirmDialog(true)}
                        >
                            Xóa
                        </Button>

                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setIsUpdate(false)}
                        >
                            Thoát
                        </Button>
                        <Button variant="contained" onClick={handleUpdateBrand}>
                            Lưu
                        </Button>
                    </Box>
                </Box>
            ) : (
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
                        <Typography variant="h5">Xóa nhãn hiệu</Typography>
                        <Close color="disabled" />
                    </Box>
                    <Typography>
                        Thao tác này sẽ xóa nhãn hiệu bạn đã chọn. Thao tác này
                        không thể khôi phục.
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
                            onClick={() => setIsUpdate(false)}
                        >
                            Thoát
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeleteBrand}
                        >
                            Xóa
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
