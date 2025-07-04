import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    CircularProgress,
    Grid,
    MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/layout/Header.tsx";
import MainBox from "../../components/layout/MainBox.tsx";

const CreateStore: React.FC = () => {
    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: "",
        city: "",
        district: "",
        ward: "",
        status: true,
        userId: JSON.parse(localStorage.getItem("user") || "{}").id
    });
    // const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);

    const navigate = useNavigate();

    // Tải tỉnh/thành
    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/?depth=1")
            .then(res => res.json())
            .then(data => setProvinces(data))
            .catch(() => setError("Không thể tải danh sách tỉnh/thành."));
    }, []);

    // Tải quận/huyện theo tỉnh
    useEffect(() => {
        if (form.city) {
            const selectedProvince = provinces.find(p => p.name === form.city);
            if (selectedProvince) {
                fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
                    .then(res => res.json())
                    .then(data => setDistricts(data.districts || []))
                    .catch(() => setError("Không thể tải danh sách quận/huyện."));
            }
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [form.city]);

    // Tải phường/xã theo quận
    useEffect(() => {
        if (form.district) {
            const selectedDistrict = districts.find(d => d.name === form.district);
            if (selectedDistrict) {
                fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
                    .then(res => res.json())
                    .then(data => setWards(data.wards || []))
                    .catch(() => setError("Không thể tải danh sách phường/xã."));
            }
        } else {
            setWards([]);
        }
    }, [form.district]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "status") {
            setForm(prev => ({ ...prev, status: value === "true" }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value,
                ...(name === 'city' ? { district: '', ward: '' } : {}),
                ...(name === 'district' ? { ward: '' } : {}),
            }));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        const payload = { ...form };

        try {
            const response = await fetch("http://localhost:8080/v1/stores", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Lỗi tạo cửa hàng.");
            }

            navigate("/stores");
        } catch (err: any) {
            setError(err.message || "Lỗi không xác định.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Header />
            <MainBox>
                <Paper sx={{ p: 4, m: 4, width: "80%",margin: "40px auto" }}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        Tạo cửa hàng mới
                    </Typography>

                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Tên cửa hàng"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Số điện thoại cửa hàng"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Địa chỉ"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                label="Tỉnh/Thành phố"
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                fullWidth
                            >
                                {provinces.map((province) => (
                                    <MenuItem key={province.code} value={province.name}>
                                        {province.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                label="Quận/Huyện"
                                name="district"
                                value={form.district}
                                onChange={handleChange}
                                fullWidth
                                disabled={!districts.length}
                            >
                                {districts.map((district) => (
                                    <MenuItem key={district.code} value={district.name}>
                                        {district.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                label="Phường/Xã"
                                name="ward"
                                value={form.ward}
                                onChange={handleChange}
                                fullWidth
                                disabled={!wards.length}
                            >
                                {wards.map((ward) => (
                                    <MenuItem key={ward.code} value={ward.name}>
                                        {ward.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                    </Grid>

                    {error && <Typography color="error" mt={2}>{error}</Typography>}

                    <Box mt={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : "Tạo cửa hàng"}
                        </Button>
                    </Box>
                </Paper>
            </MainBox>
        </Box>
    );
};

export default CreateStore;
