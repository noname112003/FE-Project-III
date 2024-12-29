import { Typography, Box, TextField, Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useState } from "react";
import { BrandRequest } from "../../../models/ProductInterface";
import "react-toastify/dist/ReactToastify.css";
import { createBrand } from "../../../services/brandAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
    setIsAdd: React.Dispatch<React.SetStateAction<boolean>>;
    onUpdate: () => void;
};

export default function UpdateBrand({ setIsAdd, onUpdate }: Props) {
    const [form, setForm] = useState<BrandRequest>({
        name: "",
        code: "",
        description: "",
    });
    function handleFormChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleCreateBrand() {
        createBrand(form)
            .then((_res) => {
                toast.success("Tạo nhãn hiệu thành công");
                onUpdate();
                setIsAdd(false);
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
                    <Typography variant="h5">Thêm mới nhãn hiệu</Typography>

                    <Close color="disabled" />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        gap: "20px",
                    }}
                >
                    <Box sx={{ width: "50%" }}>
                        <Typography sx={{ color: "#000", fontSize: "0.9rem" }}>
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
                        <Typography sx={{ color: "#000", fontSize: "0.9rem" }}>
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
                        color="primary"
                        onClick={() => setIsAdd(false)}
                    >
                        Thoát
                    </Button>

                    <Button variant="contained" onClick={handleCreateBrand}>
                        Thêm
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
