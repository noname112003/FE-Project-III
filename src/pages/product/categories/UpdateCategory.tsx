import { Typography, Box, TextField, Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useState } from "react";
import {
    CategoryRequest,
    CategoryResponse,
} from "../../../models/ProductInterface";
import { deleteCategory, updateCategory } from "../../../services/categoryAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
    setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    selectedCategory: CategoryResponse;
    onUpdate: () => void;
};

export default function UpdateCategory({
    setIsUpdate,
    selectedCategory,
    onUpdate,
}: Props) {
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [form, setForm] = useState<CategoryRequest>({ ...selectedCategory });
    function handleFormChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    function handleUpdateCategory() {
        updateCategory(form.id, form)
            .then((_res) => {
                toast.success("Cập nhật loại sản phẩm thành công");
                onUpdate();
                setIsUpdate(false);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    }

    function handleDeleteCategory() {
        deleteCategory(form.id)
            .then((_res) => {
                toast.success("Xoá loại sản phẩm thành công");
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
                        <Typography variant="h5">
                            Cập nhật loại sản phẩm
                        </Typography>

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
                                Tên loại sản phẩm
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
                                variant="body1"
                                sx={{ color: "#000", fontSize: "0.9rem" }}
                            >
                                Mã loại
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
                        <Typography
                            variant="body1"
                            sx={{ color: "#000", fontSize: "0.9rem" }}
                        >
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

                        <Button
                            variant="contained"
                            onClick={handleUpdateCategory}
                        >
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
                        <Typography variant="h5">Xóa loại sản phẩm</Typography>
                        <Close color="disabled" />
                    </Box>
                    <Typography>
                        Thao tác này sẽ xóa loại sản phẩm bạn đã chọn. Thao tác
                        này không thể khôi phục.
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
                            onClick={handleDeleteCategory}
                        >
                            Xóa
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
