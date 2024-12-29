import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";

const ChangePassword: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<string>();

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  useEffect(() => {
    const response = localStorage.getItem("user");
    if (response) {
      const userData = JSON.parse(response);
      setUser(userData.name);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setErrorMessage("Mật khẩu mới và mật khẩu xác nhận không khớp.");
      return;
    }


    try {
      const response = await fetch(
        `https://be-project-iii.onrender.com/v1/user/change_password/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password: newPassword, // send only the new password
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "OK") {
        setSuccessMessage("Mật khẩu đã thay đổi thành công.");

      } else {
        setErrorMessage(data.message || "Đổi mật khẩu thất bại.");
      }
    } catch (error) {
      setErrorMessage("Lỗi kết nối đến máy chủ.");
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: 1.5,
          marginBottom: 2,
          backgroundColor: "#ffffff",
        }}
      >
        <Box display="flex" alignItems="center">
          <Button
            variant="text"
            sx={{ color: "#637381", marginLeft: 2 }}
            onClick={() => navigate(-1)}
          >
            <KeyboardArrowLeft />
            Tài khoản của tôi
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Typography
          sx={{
            marginRight: 5,
            textTransform: "uppercase",
            color: "#0056b3", // Màu chữ
            fontFamily: "Arial, sans-serif", // Font chữ
            fontWeight: "semi bold", // Độ đậm
            fontSize: "16px", // Kích thước chữ
            padding: "10px 20px", // Kích thước nút
          }}
        >
          {user}
        </Typography>
      </Box>
      <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <Card>
          <CardContent>
          {/* <Container
        component={Paper}
        elevation={3}
        sx={{ padding: 4, marginTop: 5 }}
      > */}
        <Typography variant="h5" gutterBottom>
          Đổi mật khẩu
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box onSubmit={handleSubmit}>
          <Box mb={2}>
            <Typography>Mật khẩu mới :</Typography>
            <TextField
              fullWidth
              
              type="password"
              variant="outlined"
              value={newPassword}
              onChange={(e : React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
              required
              
            />
          </Box>
          <Box mb={2}>
            <Typography>Nhập lại mật khẩu :</Typography>
            <TextField
              fullWidth
              
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e :  React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              required
            />
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            * Mật khẩu nên có ít nhất 8 ký tự và bao gồm chữ cái, số và ký tự
            đặc biệt.
          </Typography>
          <Box>
            <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>
              Lưu
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ marginLeft: 2 }}
              onClick={() => navigate(`/account/${id}`)}
            >
              Hủy
            </Button>
          </Box>
        </Box>
      {/* </Container> */}
          </CardContent>
        </Card>
      </Box>
      
    </Box>
  );
};

export default ChangePassword;
