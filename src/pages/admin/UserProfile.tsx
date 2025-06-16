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
  MenuItem,
  TextField, Select,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MainBox from "../../components/layout/MainBox";
import MainAppBar from "../../components/layout/MainAppBar.tsx";

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
        const response = await axios.get(`http://localhost:8080/v1/user/${id}`);
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

  const isAdmin = user?.roles?.some((role) => role.name === "ROLE_ADMIN");

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("user"); // Remove user info
    navigate("/login"); // Redirect to login page
  };

  return (
    <Box>
      <MainAppBar>
        <Box display="flex" alignItems="center" justifyContent="space-between" flex={1}>
              <Typography variant="h6" sx={{
                color: '#000',
                fontFamily: '"Segoe UI", sans-serif',
                fontSize: '26px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: 'normal',
              }}>
                Tài khoản của tôi
              </Typography>
          {user && <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: '#000', fontWeight: '600' }}>{user.name}</Typography>
            <Select sx={{ '.MuiOutlinedInput-notchedOutline': { borderStyle: 'none' } }}>
              <MenuItem onClick={() => navigate(`/account/${user.id}`)}>Thông tin tài khoản</MenuItem>
              <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </Select>
          </Box>}
        </Box>
      </MainAppBar>
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
        <Card sx={{
          backgroundColor: "#F0F1F1", // Màu xám nhạt cho thẻ bên ngoài
          padding: "20px", // Khoảng cách giữa nội dung bên trong và cạnh thẻ
        }}>
          <CardContent
            sx={{ display: "flex", justifyContent: "space-between", gap: 15, backgroundColor: "#fff" }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6">Thông tin cá nhân</Typography>
              <Typography variant="h6">
                Các thông tin cơ bản của nhân viên
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 2.5,
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: 3,
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
      </MainBox>
      ) : (
        <Typography>No user found</Typography>
      )}
    </Box>
  );
};

export default UserProfile;
