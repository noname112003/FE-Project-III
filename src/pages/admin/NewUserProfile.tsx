import React, { useState, useEffect } from "react";
import {
    Box,
    CircularProgress,
    Grid,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {toast} from "react-toastify";
import MainBox from "../../components/layout/MainBox.tsx";
import Header from "../../components/layout/Header.tsx";

// Role options that match backend roles
const roleOptions = [
    {id: 1, value: "ROLE_ADMIN", label: "ADMIN (Chủ cửa hàng)" },
    {id: 3, value: "ROLE_REPOSITORY", label: "NHÂN VIÊN KHO (Quản lý kho)" },
    {id: 2, value: "ROLE_SALE", label: "NHÂN VIÊN BÁN HÀNG (Quản lý bán hàng)" },
    // { value: "ROLE_SUPPORT", label: "NHÂN VIÊN CHĂM SÓC (Chăm sóc khách hàng)" },
];
const NewUserProfile = () => {
    const { id } = useParams<{ id: string }>(); // Extract the user ID from the URL
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
    const [active, setActive] = useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    // Fetch user details on component mount
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/v1/user/${id}`);
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
            (birthDay?.format("YYYY-MM-DD") || "") !== (initialData.birthDay?.format("YYYY-MM-DD") || "") ||
            newPassword.length > 0 ||
            confirmPassword.length > 0
        );
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // const handleRoleChange = (event: SelectChangeEvent) => {
    //     setRole(event.target.value as string);
    // };

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

        if (active) {
            if (!newPassword.trim() || !confirmPassword.trim()) {
                toast.error("Vui lòng nhập đầy đủ mật khẩu mới và xác nhận mật khẩu.");
                return;
            }
            if (/\s/.test(newPassword)) {
                toast.error("Mật khẩu không được chứa khoảng trắng.");
                return;
            }
            if (newPassword.length < 6 || newPassword.length > 32) {
                toast.error("Mật khẩu phải có độ dài từ 6 đến 32 ký tự.");
                return;
            }
            if (newPassword !== confirmPassword) {
                toast.error("Mật khẩu xác nhận không khớp.");
                return;
            }
        }
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
            password: active ? newPassword : undefined,
        };

        try {
            const response = await fetch(`http://localhost:8080/v1/user/${id}`, {
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
                setActive(false);
                setNewPassword("");
                setConfirmPassword("");
                // navigate(`/admin/user/${id}`); // Navigate back to the user list after successful update
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    // if (loading) {
    //   return <Typography><CircularProgress/></Typography>; // Show loading state
    // }

    const roleMap: { [key: string]: string } = {
        ROLE_ADMIN: "ADMIN (Chủ cửa hàng)",
        // ROLE_REPOSITORY: "NHÂN VIÊN KHO (Quản lý kho)",
        ROLE_SALE: "NHÂN VIÊN BÁN HÀNG (Quản lý bán hàng)",
        ROLE_SUPPORT: "NHÂN VIÊN CHĂM SÓC (Chăm sóc khách hàng)",
    };

    return (
        <Box>
            <Header/>

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
                    <MainBox>
                        <Box
                            sx={{ margin: "0 auto", maxWidth: "70%", }}
                        >
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
                            <Card elevation={0} sx={{ backgroundColor: "#F0F1F1", margin: "20px" }}>
                                <CardContent sx={{ display: "flex", padding: 0, justifyContent: "space-between", gap: 15, backgroundColor: "#F0F1F1",  }}>
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
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    value={roleMap[role] || ""}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                />
                                                {/*<FormControl fullWidth>*/}
                                                {/*    <Select*/}
                                                {/*        value={role}*/}
                                                {/*        onChange={handleRoleChange}*/}
                                                {/*        label="Vai trò"*/}
                                                {/*        required*/}
                                                {/*    >*/}
                                                {/*        {roleOptions.map((option) => (*/}
                                                {/*            <MenuItem key={option.value} value={option.value}>*/}
                                                {/*                {option.label}*/}
                                                {/*            </MenuItem>*/}
                                                {/*        ))}*/}
                                                {/*    </Select>*/}
                                                {/*</FormControl>*/}

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
                                        <Box>
                                            <Box sx={{ fontWeight: 600,
                                                fontSize: "30px",
                                                color: "#0F172A",
                                                borderTop: "1px solid #E5E7EB",
                                                paddingTop: "24px",
                                                marginTop: "24px",}}
                                            >
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    Đổi mật khẩu
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: "#6B7280", marginTop: "4px" }}>
                                                    Đổi mật khẩu mà bạn sử dụng để đăng nhập vào quản trị tài khoản
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {active ?
                                            <Box mt={3}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            fullWidth
                                                            label="Mật khẩu mới"
                                                            name="newPassword"
                                                            type="password"
                                                            variant="outlined"
                                                            inputProps={{ minLength: 6, maxLength: 32 }}
                                                            autoComplete="new-password"
                                                            value={newPassword}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                                                            required
                                                            // value={form.newPassword}
                                                            // onChange={handleChange}
                                                            // error={Boolean(errors.newPassword)}
                                                            // helperText={errors.newPassword || "Mật khẩu phải có độ dài từ 6 đến 32 ký tự"}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            fullWidth
                                                            label="Xác nhận lại mật khẩu"
                                                            name="confirmPassword"
                                                            type="password"
                                                            variant="outlined"
                                                            value={confirmPassword}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                                            required
                                                            // value={form.confirmPassword}
                                                            // onChange={handleChange}
                                                            // error={Boolean(errors.confirmPassword)}
                                                            // helperText={errors.confirmPassword}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                            :
                                            <Button
                                                color="primary"
                                                sx={{ textTransform: "none", fontSize: "16px" , marginTop: 2, padding: 0 }}
                                                variant="text"
                                                // onClick={() => navigate(`/account/change-password/${id}`)}
                                                onClick={() => setActive(true)}
                                            >
                                                Đổi mật khẩu
                                            </Button>
                                        }
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
                    </MainBox>

                )}

        </Box>
    );
};

export default NewUserProfile;
