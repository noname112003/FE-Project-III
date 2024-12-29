import React, { useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import {toast} from "react-toastify";

type Props = {};

// Define the role mappings
// const roleMappings: { [key: string]: string } = {
//   ROLE_ADMIN: "ADMIN",
//   ROLE_REPOSITORY: "NHÂN VIÊN KHO",
//   ROLE_SALE: "NHÂN VIÊN BÁN HÀNG",
//   ROLE_SUPPORT: "NHÂN VIÊN CHĂM SÓC",
// };

// Role options that match backend roles
const roleOptions = [
  { value: "ROLE_ADMIN", label: "ADMIN" },
  { value: "ROLE_REPOSITORY", label: "NHÂN VIÊN KHO" },
  { value: "ROLE_SALE", label: "NHÂN VIÊN BÁN HÀNG" },
  { value: "ROLE_SUPPORT", label: "NHÂN VIÊN CHĂM SÓC" },
];

export default function CreateUser({}: Props) {
  const [role, setRole] = useState<string>("");
  const [birthDay, setBirthDay] = useState<Dayjs | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const [nameError, setNameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const [roleError, setRoleError] = useState<string>("");
  const navigate = useNavigate();

  // Update form data
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Handle role change
  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as string);
  };

  // Handle date change for date of birth
  const handleDateChange = (newValue: Dayjs | null) => {
    setBirthDay(newValue);
  };

  // Function to check if email and phone number are unique
  const checkEmail = async () => {
    try {
      const response = await fetch(
        `https://be-project-iii.onrender.com/v1/user/check-email/${formData.email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.status === "OK") {
        // Email exists, show error message
        setEmailError("Email đã tồn tại");
        return false;
      } else if (
        result.status === "INTERNAL_SERVER_ERROR" ||
        result.message === "Email không được tìm thấy"
      ) {
        // Email not found, reset error
        setEmailError("");
        return true;
      } else {
        // Handle any other error case
        setEmailError("Có lỗi xảy ra khi kiểm tra email");
        return false;
      }
    } catch (error) {
      console.error("Error checking uniqueness:", error);
      setEmailError("Lỗi kết nối. Vui lòng thử lại");
      return false;
    }
  };

  // Function to validate email format
  const validateEmailFormat = (email: string): boolean => {
    // Regex for validating email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to validate phone number format and length
const validatePhoneNumber = (phoneNumber: string): boolean => {
  // Check if phone number has exactly 10 digits
  return phoneNumber.length === 10 && /^[0-9]+$/.test(phoneNumber);
};

  // const checkPhoneNumber = async () => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8080/v1/user/check-phoneNumber/${formData.phoneNumber}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const result = await response.json();

  //     if (response.ok && result.status === "OK") {
  //       // Phone exists, show error message
  //       setPhoneError("Phone Number đã tồn tại");
  //       return false;
  //     } else if (result.status === "INTERNAL_SERVER_ERROR" && result.message === "Số điện thoại không được tìm thấy") {
  //       // PHone not found, reset error
  //       setPhoneError("");
  //       return true;
  //     } else {
  //       // Handle any other error case
  //       setPhoneError("Có lỗi xảy ra khi kiểm tra phone number");
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error("Error checking uniqueness:", error);
  //     setPhoneError("Lỗi kết nối. Vui lòng thử lại");
  //     return false;
  //   }
  // };

  // Submit form to the API
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setNameError("Tên không được để trống .");
      return;
    }

    if (!formData.email.trim()) {
      setEmailError("Email không được để trống.");
      return; // Exit if email is empty
    }

    // Validate email format
    if (!validateEmailFormat(formData.email)) {
      setEmailError("Định dạng email không hợp lệ.");
      return;
    }
    if (!role) {
      setRoleError("Vai trò không được để trống.");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      setPhoneNumberError("Số điện thoại không được để trống.");
      return; // Exit if phone number is empty
    }

      // Validate phone number format and length
  if (!validatePhoneNumber(formData.phoneNumber)) {
    setPhoneNumberError("Số điện thoại có 10 chữ số.");
    return;
  }

    if (!formData.password.trim()) {
      setPasswordError("Mật khẩu không được để trống .");
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Mật khẩu và xác nhận mật khẩu không trùng khớp");
      return;
    }

    // Reset password error
    setRoleError("");
    setPasswordError("");
    setNameError("");
    setEmailError("");
    setPhoneNumberError("");

    // Check if email and phone number are unique
    const isUnique = await checkEmail();
    if (!isUnique) return; // Stop submission if email or phone is not unique
    // const isUniquePhoneNumber = await checkPhoneNumber();
    // if (!isUniquePhoneNumber) return;

    const user = {
      ...formData,
      birthDay: birthDay ? birthDay.format("YYYY-MM-DD") : null,
      roles: [{ name: role }],
    };

    try {
      const response = await fetch("https://be-project-iii.onrender.com/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Tạo tài khoản thành công!');
        navigate(`/admin/user/${result.id}`);
        console.log("User created successfully:", result);
      } else {
        console.error("Lỗi khi tạo tài khoản:", result);
      }
    } catch (error) {
      console.error("Lỗi:", error);
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
            onClick={() => navigate("/admin/user")}
          >
            <KeyboardArrowLeft /> Quay lại danh sách nhân viên
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
      </Box>
      <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Thông tin nhân viên
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>Tên nhân viên</Typography>
                <TextField
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!nameError}
                  helperText={nameError}
                />
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <Typography>Vai trò</Typography>
                  <Select
                    value={role}
                    onChange={handleRoleChange}
                    error={!!roleError}
                  >
                    {roleOptions.map((roleOption) => (
                      <MenuItem key={roleOption.value} value={roleOption.value}>
                        {roleOption.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <Typography>Mật khẩu</Typography>
                <TextField
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!passwordError}
                  helperText={passwordError}
                />
              </Grid>

              <Grid item xs={6}>
                <Typography>Xác nhận mật khẩu</Typography>
                <TextField
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!passwordError}
                  helperText={passwordError}
                />
              </Grid>

              <Grid item xs={6}>
                <Typography>Email</Typography>
                <TextField
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  error={!!emailError}
                  helperText={emailError}
                />
              </Grid>

              <Grid item xs={6}>
                <Typography>Số điện thoại</Typography>
                <TextField
                  name="phoneNumber"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  fullWidth
                  error={!!phoneNumberError}
                  helperText={phoneNumberError}
                />
              </Grid>

              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Ngày sinh"
                    format="DD/MM/YYYY"
                    value={birthDay}
                    onChange={handleDateChange}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            {/* Save Button */}
            <Box mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Lưu
              </Button>
            </Box>
          </CardContent>
        </Card>
        {/* Form Title */}
      </Box>
    </Box>
  );
}
