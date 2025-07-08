import React, { useState } from "react";
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
import {toast} from "react-toastify";
import MainBox from "../../components/layout/MainBox";
import MainAppBar from "../../components/layout/MainAppBar.tsx";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import AccountSection from "../product/AccountSection.tsx";

const ChangePassword: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const [user, setUser] = useState<string>();
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  // useEffect(() => {
  //   const response = localStorage.getItem("user");
  //   // if (response) {
  //   //   const userData = JSON.parse(response);
  //   //   // setUser(userData.name);
  //   // }
  // }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if(oldPassword === "") {
      setErrorMessage("Mật khẩu cũ không được để trống");
      return;
    }
    if (oldPassword === newPassword) {
      setErrorMessage("Mật khẩu cũ và mật khẩu mới trùng nhau.");
      return;
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setErrorMessage("Mật khẩu mới và mật khẩu xác nhận không khớp.");
      return;
    }


    try {
      const response = await fetch(
        `https://store-manager-ixub.onrender.com/v1/user/change_password/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password: newPassword, // send only the new password
            oldPassword: oldPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "OK") {
        toast.success("Mật khẩu đã thay đổi thành công.");
        setTimeout(() => {
          navigate(`/account/${id}`);
        }, 1000);
      } else {
        setErrorMessage(data.message || "Đổi mật khẩu thất bại.");
      }
    } catch (error) {
      setErrorMessage("Lỗi kết nối đến máy chủ.");
    }
  };

  return (
    <Box>
      {/*<Box*/}
      {/*  sx={{*/}
      {/*    display: "flex",*/}
      {/*    alignItems: "center",*/}
      {/*    marginTop: 1.5,*/}
      {/*    marginBottom: 2,*/}
      {/*    backgroundColor: "#ffffff",*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Box display="flex" alignItems="center">*/}
      {/*    <Button*/}
      {/*      variant="text"*/}
      {/*      sx={{ color: "#637381", marginLeft: 2 }}*/}
      {/*      onClick={() => navigate(-1)}*/}
      {/*    >*/}
      {/*      <KeyboardArrowLeft />*/}
      {/*      Tài khoản của tôi*/}
      {/*    </Button>*/}
      {/*  </Box>*/}
      {/*  <Box sx={{ flexGrow: 1 }} />*/}
      {/*  <Typography*/}
      {/*    sx={{*/}
      {/*      marginRight: 5,*/}
      {/*      textTransform: "uppercase",*/}
      {/*      color: "#0056b3", // Màu chữ*/}
      {/*      fontFamily: "Arial, sans-serif", // Font chữ*/}
      {/*      fontWeight: "semi bold", // Độ đậm*/}
      {/*      fontSize: "16px", // Kích thước chữ*/}
      {/*      padding: "10px 20px", // Kích thước nút*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    {user}*/}
      {/*  </Typography>*/}
      {/*</Box>*/}
      <MainAppBar>
        <Box sx={{ display: "flex",width: "100%",justifyContent:'space-between'}}>
          <Button
              onClick={() => navigate(-1)}
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
            Quay lại thiết lập tài khoản
          </Button>
          <AccountSection/>
        </Box>
      </MainAppBar>
      <MainBox>
        <Card sx={{padding: '24px 30px'}}>
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
                <Typography>Mật khẩu cũ :</Typography>
                <TextField
                  fullWidth

                  type="password"
                  variant="outlined"
                  value={oldPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value)}
                  required

                />
              </Box>
              <Box mb={2}>
                <Typography>Mật khẩu mới :</Typography>
                <TextField
                  fullWidth

                  type="password"
                  variant="outlined"
                  value={newPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
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
      </MainBox>

    </Box>
  );
};

export default ChangePassword;
