import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AccessDeniedPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate("/"); // Điều hướng về trang chủ hoặc trang khác
    };

    return (

        <Container
            maxWidth="md"
            sx={{
                textAlign: "center",
                marginTop: 10,
                padding: 4,
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Box sx={{ mb: 4 }}>
                <Typography variant="h1" color="error" gutterBottom>
                    403
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Không được phép truy cập
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên hoặc quay lại trang chủ.
                </Typography>
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={handleGoBack}
                sx={{ mt: 2 }}
            >
                Quay lại Trang chủ
            </Button>
        </Container>
    );
};

export default AccessDeniedPage;