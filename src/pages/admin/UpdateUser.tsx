import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  Card,
  CardContent,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {toast} from "react-toastify";
import MainBox from "../../components/layout/MainBox.tsx";
import Header from "../../components/layout/Header.tsx";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";

// Role options that match backend roles
const roleOptions = [
  // { value: "ROLE_ADMIN", label: "ADMIN (Chủ cửa hàng)" },
  {id: 3, value: "ROLE_REPOSITORY", label: "NHÂN VIÊN KHO (Quản lý kho)" },
  {id: 2, value: "ROLE_SALE", label: "NHÂN VIÊN BÁN HÀNG (Quản lý bán hàng)" },
  // { value: "ROLE_SUPPORT", label: "NHÂN VIÊN CHĂM SÓC (Chăm sóc khách hàng)" },
];

const UpdateUser = () => {
  const { id } = useParams<{ id: string }>(); // Extract the user ID from the URL
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<{
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    status: boolean | null;
    birthDay: Dayjs | null;
    role: string;
  }>({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    status: null,
    birthDay: null,
    role: "",
  });
  // State to hold the user details
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    status: false as boolean | null,
  });
  const [birthDay, setBirthDay] = useState<Dayjs | null>(null);
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [nameError , setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`https://store-manager-ixub.onrender.com/v1/user/${id}`);
        const { data } = await response.json(); // Fetch the data from the response

        // Prefill form with user details
        setFormData({
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
          status: data.status,
        });
        const bd: Dayjs | null = dayjs(data.birthDay || null);        // Parse createdOn date properly
        setBirthDay(dayjs(data.birthDay || null));
        console.log(data.birthDay);
        setInitialData({
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
          status: data.status,
          birthDay: bd,
          role: data.roles?.[0].name || "",
        });
        // Assuming the first role in the array is the one to be shown
        setRole(data.roles?.[0]?.name || "");
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);
  const isFormChanged = () => {
    return (
        formData.name !== initialData.name ||
        formData.email !== initialData.email ||
        formData.phoneNumber !== initialData.phoneNumber ||
        formData.address !== initialData.address ||
        role !== initialData.role ||
        (birthDay?.format("YYYY-MM-DD") || "") !== (initialData.birthDay?.format("YYYY-MM-DD") || "")
    );
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as string);
  };

  const handleDateChange = (value: Dayjs | null) => {
    setBirthDay(value);
  };

  // Hàm kiểm tra định dạng email hợp lệ
  const validateEmailFormat = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {

    if(!formData.name.trim()){
      setNameError("Tên không được để trống .");
      return;
    }
    setNameError("");
    if (!formData.email.trim()) {
      setEmailError("Email không được để trống.");
      return; // Exit if email is empty
    }
    // Kiểm tra định dạng email hợp lệ
    if (!validateEmailFormat(formData.email)) {
      setEmailError("Định dạng email không hợp lệ.");
      return;
    }
    setEmailError("");
    if (!formData.phoneNumber.trim()) {
      setPhoneNumberError("Số điện thoại không được để trống");
      return;
    }
    setPhoneNumberError("");

    // Map the selected role to the corresponding role object
    const selectedRole = roleOptions.find((option) => option.value === role);
    const roleToSubmit = selectedRole
      ? {
          id: selectedRole.id, // Assuming IDs are sequential starting from 1
          name: selectedRole.value,
        }
      : null;

    // Prepare data for submission
    const updatedData = {
      ...formData,
      roles: roleToSubmit ? [roleToSubmit] : [], // Include roles in the expected format
      birthDay: birthDay ? birthDay.format("YYYY-MM-DD") : null,
    };

    try {
      const response = await fetch(`https://store-manager-ixub.onrender.com/v1/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        console.error("Failed to update user");
        toast.error('Không thể cập nhật thông tin');
        // Handle error case
      } else {
        console.log("User updated successfully");
        toast.success('Cập nhật thông tin thành công');
        navigate(`/admin/user/${id}`); // Navigate back to the user list after successful update
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  // if (loading) {
  //   return <Typography><CircularProgress/></Typography>; // Show loading state
  // }

  return (
    <Box>
      <Header/>
      <MainBox>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh", // Full viewport height to vertically center
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{ margin: "0 auto", maxWidth: "70%", }}
          >
            <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  margin: "20px 20px 0 20px",
                  // backgroundColor: "#ffffff",
                }}
            >
              <Box display="flex" alignItems="center">
                <Button
                    variant="text"
                    sx={{ color: "#747c87", marginLeft: "-5px", padding: 0 }}
                    onClick={() => navigate(-1)}
                >
                  <KeyboardArrowLeft /> Quay lại màn chi tiết nhân viên
                </Button>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
            </Box>

            <Card elevation={0} sx={{ backgroundColor: "#F0F1F1", margin: "20px" }}>
              <CardContent sx={{ display: "flex", padding: 0, justifyContent: "space-between", gap: 15, backgroundColor: "#F0F1F1",  }}>
                <Box sx={{ flexBasis: "30%", maxWidth: "30%" }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Tài khoản nhân viên
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6B7280", marginTop: "4px" }}>
                    Thông tin tài khoản, phân quyền của nhân viên
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
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>Tên nhân viên : </Typography>
                    <TextField
                      fullWidth
                      name="name"
                      variant="outlined"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      error={!!nameError}
                      helperText={nameError}
                    />

                    <Typography variant="body1" sx={{marginTop: 2, fontWeight: "bold" }}>Email :</Typography>
                    <TextField
                        fullWidth
                        name="email"
                        variant="outlined"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        error={!!emailError}
                        helperText={emailError}
                    />
                    <Typography variant="body1" sx={{marginTop: 2, fontWeight: "bold" }}>Địa chỉ</Typography>
                    <TextField
                        fullWidth
                        name="address"
                        variant="outlined"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>Số điện thoại :</Typography>
                    <TextField
                        fullWidth
                        name="phoneNumber"
                        variant="outlined"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        error={!!phoneNumberError}
                        helperText={phoneNumberError}
                    />

                    <Typography variant="body1" sx={{marginTop: 2, fontWeight: "bold" }}>Vai trò</Typography>
                    <FormControl fullWidth>
                      <Select
                          value={role}
                          onChange={handleRoleChange}
                          label="Vai trò"
                          required
                      >
                        {roleOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Typography variant="body1" sx={{marginTop: 2, fontWeight: "bold" }}>Ngày sinh :</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                          format="DD/MM/YYYY"
                          value={birthDay}
                          onChange={handleDateChange}
                      />
                    </LocalizationProvider>
                  </Grid>

                </Grid>
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
                  onClick={() => {
                    setFormData({
                      name: initialData.name,
                      email: initialData.email,
                      phoneNumber: initialData.phoneNumber,
                      address: initialData.address,
                      status: initialData.status,
                    });
                    setBirthDay(initialData.birthDay);
                    setRole(initialData.role);
                    setNameError("");
                    setEmailError("");
                    setPhoneNumberError("");
                  }}
                  disabled={!isFormChanged()}
              >
                Huỷ
              </Button>
              <Button
                  sx={{}}
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={!isFormChanged()}
              >
                Lưu thay đổi
              </Button>
            </Box>
          </Box>
        )}
      </MainBox>
    </Box>
  );
};

export default UpdateUser;
