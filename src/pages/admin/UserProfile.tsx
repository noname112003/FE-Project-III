import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MainBox from "../../components/layout/MainBox";
import Header from "../../components/layout/Header.tsx";

interface Role {
  id: number;
  name: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  birthDay: string;
  roles: Role[];
  createdOn: string;
  updateOn: string;
}

const roleMap: { [key: string]: string } = {
  ROLE_ADMIN: "ADMIN (Chủ cửa hàng)",
  // ROLE_REPOSITORY: "NHÂN VIÊN KHO (Quản lý kho)",
  ROLE_SALE: "NHÂN VIÊN BÁN HÀNG (Quản lý bán hàng)",
  ROLE_SUPPORT: "NHÂN VIÊN CHĂM SÓC (Chăm sóc khách hàng)",
};

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserData | null>(null);
  // const [currentUser, setCurrentUser] = useState<any>(null);
  // const [anchorEl, setAnchorEl] = useState<any | HTMLElement>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://store-manager-ixub.onrender.com/v1/user/${id}`);
        if (response.data.status === "OK") {
          setUser(response.data.data);
        }
      } catch (err: any) {
        setError("Không thể lấy thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);
  console.log(user);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Header/>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh", // Ensures the loader is centered in a minimum height area
          }}
        >
          <CircularProgress />
        </Box>
      ) : user ? (
      <MainBox>

        <Box sx={{
          maxWidth: "70%",
          margin: "0 auto",         // Căn giữa
        }}>
          <Box
              sx={{
                fontWeight: 600,
                fontSize: "30px",
                color: "#0F172A",
                margin: "20px",
                borderBottom: "1px solid #E5E7EB",
                paddingBottom: "24px",
                marginBottom: "24px",
              }}
          >
            Tài khoản của tôi
          </Box>
          <Card elevation={0}
          sx={{
            backgroundColor: "#F0F1F1", // Màu xám nhạt cho thẻ bên ngoài
            margin: "20px", // Khoảng cách giữa nội dung bên trong và cạnh thẻ
          }}>
            <CardContent
                sx={{ display: "flex", padding: 0, justifyContent: "space-between", gap: 15, backgroundColor: "#F0F1F1",  }}
            >
              <Box sx={{ flexBasis: "30%", maxWidth: "30%" }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Thông tin tài khoản
                </Typography>
                <Typography variant="body2" sx={{ color: "#6B7280", marginTop: "4px" }}>
                  Các thông tin cơ bản của tài khoản đang đăng nhập hệ thống
                </Typography>
              </Box>

              <Box
                  sx={{
                    flexBasis: "70%",
                    maxWidth: "70%",
                    border: "1px solid #ccc",
                    borderRadius: "12px",
                    padding: 3, backgroundColor: "white"
                  }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Tên nhân viên :
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={user?.name || ""}
                        InputProps={{
                          readOnly: true,
                        }}
                    />

                    <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", marginTop: 2 }}
                    >
                      Email:{" "}
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={user?.email || ""}
                        InputProps={{
                          readOnly: true,
                        }}
                    />
                    <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", marginTop: 2 }}
                    >
                      Địa chỉ:
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={user?.address || ""}
                        InputProps={{
                          readOnly: true,
                        }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Số điện thoại:
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={user?.phoneNumber || ""}
                        InputProps={{
                          readOnly: true,
                        }}
                    />
                    <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", marginTop: 2 }}
                    >
                      Vai trò:
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={
                          // user?.roles.map((role) => role.name).join(", ") || ""
                          user?.roles
                              .map((role) => roleMap[role.name] || role.name || "") // Map role names
                              .join(", ")
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                    />
                    <Typography
                        variant="body2"
                        sx={{ fontWeight: "bold", marginTop: 2 }}
                    >
                      BirthDay
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={
                            (user?.birthDay &&
                                new Date(user.birthDay).toLocaleDateString('en-GB')) ||
                            ""
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                    />
                  </Grid>
                </Grid>

                {/* <Typography variant="body2">
                  Cập nhật lần cuối:{" "}
                  {user?.updateOn && new Date(user?.updateOn).toLocaleString()}
                </Typography> */}
                <Button
                    color="primary"
                    sx={{ textTransform: "none", fontSize: "16px" , marginTop: 2 }}
                    variant="text"
                    onClick={() => navigate(`/account/change-password/${id}`)}
                >
                  Đổi mật khẩu
                </Button>
              </Box>
            </CardContent>
          </Card>
          <Box sx={{
            display: "flex",               // thêm dòng này
            justifyContent: "flex-end", gap: 2,
            fontWeight: 600,
            fontSize: "30px",
            color: "#0F172A",
            margin: "20px",
            borderTop: "1px solid #E5E7EB",
            paddingTop: "20px",
            marginTop: "20px",
          }}>
            <Button
                variant="outlined"
                color="inherit"
                // onClick={() => {
                //   setFormData({
                //     name: initialData.name,
                //     email: initialData.email,
                //     phoneNumber: initialData.phoneNumber,
                //     address: initialData.address,
                //     status: initialData.status,
                //   });
                //   setBirthDay(initialData.birthDay);
                //   setRole(initialData.role);
                //   setNameError("");
                //   setEmailError("");
                //   setPhoneNumberError("");
                // }}
                // disabled={!isFormChanged()}
            >
              Huỷ
            </Button>
            <Button
                sx={{}}
                variant="contained"
                color="primary"
                // onClick={handleSubmit}
                // disabled={!isFormChanged()}
            >
              Lưu thay đổi
            </Button>
          </Box>
        </Box>
      </MainBox>
      ) : (
        <Typography>No user found</Typography>
      )}
    </Box>
  );
};

export default UserProfile;
