import React, { useState } from "react";
import axios from "axios";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box, Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(false);
        setMessage("");
        try {
            await axios.post(
                "http://localhost:8080/v1/user/reset-password", // URL gốc
                null, // Không truyền body
                {
                    params: { email }, // Truyền email dưới dạng query parameters
                }
            );
            setMessage("Mật khẩu mới đã được gửi đến email của bạn. Đang chuyển hướng...");
            setTimeout(() => {
                navigate("/login", { state: { email } }); // Chuyển đến trang login
            }, 2000); // Delay 3 giây trước khi chuyển hướng
        } catch (error: any) {
            setError(true);
            setMessage(error.response?.data?.message || "Đã xảy ra lỗi không xác định.");
        }
    };


    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, p: 4, border: "1px solid #ccc", borderRadius: "8px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
                <Typography variant="h4" align="center">Nhập email </Typography>
                {message && (
                    <Alert severity={error ? "error" : "success"} sx={{ mt: 2 }}>
                        {message}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit}>
                    <Box sx={{ marginTop: 4 }}>
                        <Typography sx={{ marginBottom: -1 }}>Email</Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Gửi yêu cầu
                    </Button>
                </Box>
                <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Button variant="text" color="primary" onClick={() => navigate("/login")}>
                        Quay lại đăng nhập
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ForgotPasswordPage;
