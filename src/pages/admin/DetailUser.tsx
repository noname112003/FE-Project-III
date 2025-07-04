import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import "react-toastify/dist/ReactToastify.css";
import {toast} from "react-toastify";
import MainBox from "../../components/layout/MainBox.tsx";
import MainAppBar from "../../components/layout/MainAppBar.tsx";

interface Role {
  id: number;
  name: string;
}

const roleMap: { [key: string]: string } = {
  ROLE_ADMIN: "ADMIN (Chủ cửa hàng)",
  ROLE_REPOSITORY: "NHÂN VIÊN KHO (Quản lý kho)",
  ROLE_SALE: "NHÂN VIÊN BÁN HÀNG (Quản lý bán hàng)",
  // ROLE_SUPPORT: "NHÂN VIÊN CHĂM SÓC (Chăm sóc khách hàng)",
};

interface UserDetail {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: boolean;
  birthDay: string;
  roles: Role[];
  createdOn: string;
  updateOn: string | null;
}

export default function DetailUser() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/v1/user/${id}`);
        const jsonResponse = await response.json();
        if (response.ok) {
          setUser(jsonResponse.data);
        } else {
          console.error("Failed to fetch user details", jsonResponse.message);
        }
      } catch (error) {
        console.error("Network error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"; // Handle null values gracefully
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Format as "dd/MM/yyyy"
  };

  const handleResetPassword = async () => {
    // const token = localStorage.getItem('token'); // Retrieve token from localStorage
    // if (!token) {
    //   setErrorMessage('Không tìm thấy token xác thực.');
    //   return;
    // }
    try {
      const response = await fetch(
        `http://localhost:8080/v1/admin/reset_password/${id}`,
        {
          method: "PUT",
          // headers: {
          //   // 'Content-Type': 'application/json',
          //   // Authorization: `Bearer ${token}`,
          // },
        }
      );
      // if (response.ok && data.status === 'OK') {
      //   setSuccessMessage('Mật khẩu đã thay đổi thành công.');
      // } else {
      //   setErrorMessage(data.message || 'Đổi mật khẩu thất bại.');
      // }
      if (response.ok) {
        console.log("Password reset successfully");
        toast.success('Mật khẩu đã được khôi phục');
      } else {
        const jsonResponse = await response.json();
        toast.error('Mật khẩu không thể khôi phục');
        console.error("Không thể khôi phục password", jsonResponse.message);
      }
      navigate("/admin/user");
    } catch (error) {
      console.error("Network error", error);
    } finally {
      setOpenDialog(false);
    }
  };
  const formatDateForAPI = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);

    // Format as "yyyy-MM-dd'T'HH:mm:ss" and remove the `Z` at the end
    return date.toISOString().slice(0, 19); // This removes the timezone 'Z'
  };

  const handleToggleStatus = async () => {
    if (!user) return;

    const updatedStatus = !user.status; // Toggle the current status

    try {
      const response = await fetch(`http://localhost:8080/v1/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...user,
          status: updatedStatus, // Ensure this is a boolean value, not null
          createdOn: formatDateForAPI(user.createdOn), // Send the formatted date
          updateOn: formatDateForAPI(new Date().toISOString()), // Send current date
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        if (updatedUser && updatedUser.data) {
          // setUser((prevUser) => ({
          //   ...prevUser,
          //   status: updatedUser.data.status ?? updatedStatus, // Use updated status if returned, otherwise use the toggled status
          // }));
          setUser(updatedUser.data);
          toast.success("Thay đổi trạng thái tài khoản thành công");
        }
      } else {
        console.error("Failed to update user status");
      }
    } catch (error) {
      console.error("Network error", error);
    }
  };

  // if (loading) {
  //   return <CircularProgress />;
  // }

  // if (!user) {
  //   return <Typography>No user found</Typography>;
  // }

  return (
    <Box>
      <MainAppBar>
        <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "space-between",
            }}
        >
          <Button
              variant="text"
              sx={{
                textTransform: "none",
                color: "rgba(0,0,0,0.38)",
                fontSize: "1rem",
              }}
              onClick={() => navigate("/admin/user")}
          >
            <KeyboardArrowLeft />
            Quay lại danh sách nhân viên
          </Button>

          {user && (
              <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                      navigate(`/admin/user/update/${user.id}`, { state: user })
                  }
              >
                Sửa thông tin
              </Button>
          )}
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
            <Box sx={{ padding: 3, backgroundColor: "#F0F1F1", minHeight: "100vh" }}>
              <Card
                  sx={{ maxWidth: 800, margin: "0 auto", padding: 3, boxShadow: 3 }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    Thông tin nhân viên
                  </Typography>
                  <Divider sx={{ marginY: 2 }} />
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Typography>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Tên nhân viên :{" "}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: 1 }}>
                          {user.name}
                        </Typography>
                      </Typography>
                      <Typography>
                        <Typography sx={{ fontWeight: "bold" }}>Email :</Typography>
                        <Typography variant="body1" sx={{ marginBottom: 1 }}>
                          {user.email}
                        </Typography>
                      </Typography>

                      <Typography>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Cập nhật lần cuối :
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: 1 }}>
                          {" "}
                          {formatDate(user.updateOn)}
                        </Typography>
                      </Typography>

                      <Typography>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Trạng thái tài khoản :{" "}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: 1 }}>
                          <Chip
                              label={user.status ? "Hoạt động" : "Khoá"}
                              color={user.status ? "success" : "error"}
                              size="small"
                              sx={{ marginLeft: 1 }}
                          />
                        </Typography>
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography>
                        <Typography sx={{ fontWeight: "bold" }}>Vai trò :</Typography>
                        <Typography variant="body1" sx={{ marginBottom: 1 }}>
                          {user.roles
                              .map((role) => roleMap[role.name] || role.name)
                              .join(", ")}
                        </Typography>
                      </Typography>
                      <Typography>
                        <Typography sx={{ fontWeight: "bold" }}>
                          {" "}
                          Số điện thoại:{" "}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: 1 }}>
                          {user.phoneNumber}
                        </Typography>
                      </Typography>
                      <Typography>
                        <Typography sx={{ fontWeight: "bold" }}>Địa chỉ :</Typography>
                        <Typography variant="body1" sx={{ marginBottom: 1 }}>
                          {user.address}
                        </Typography>
                      </Typography>
                      <Typography>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Ngày sinh :
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: 1 }}>
                          {formatDate(user.birthDay)}
                        </Typography>
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ marginY: 2 }} />

                  <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ width: "200px" }}
                        onClick={() => setOpenDialog(true)}
                    >
                      Khôi phục mật khẩu
                    </Button>
                    <Button
                        variant="outlined"
                        color={user.status ? "error" : "success"}
                        sx={{ width: "200px" }}
                        onClick={handleToggleStatus}
                    >
                      {user.status ? "Khoá tài khoản" : "Mở khóa tài khoản"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Xác nhận khôi phục mật khẩu</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Bạn có chắc chắn muốn khôi phục mật khẩu cho nhân viên {user.name}{" "}
                    không?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDialog(false)} color="primary">
                    Hủy
                  </Button>
                  <Button onClick={handleResetPassword} color="primary">
                    Khôi phục mật khẩu
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </MainBox>
      ) : (
        <Typography>No user found</Typography>
      )}
    </Box>
  );
}
