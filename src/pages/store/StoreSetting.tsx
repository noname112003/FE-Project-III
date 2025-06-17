import {
    Box, Button, FormControl,
    TextField,
    Typography
} from "@mui/material"
import MainBox from "../../components/layout/MainBox"
import React, { useEffect, useState } from "react";

import Header from "../../components/layout/Header.tsx";
import  "../styles.css"
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {toast} from "react-toastify";
import {getStores} from "../../services/storeAPI.ts";
import {setStores} from "../../reducers/storesReducer.tsx";
import {setStore} from "../../reducers/storeSettingReducer.tsx";


export default function StoreSetting() {
    const store = useSelector((state: any) => state.storeSetting.store);
    const user = JSON.parse(localStorage.getItem("user") as string);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        district: "",
        ward: "",
        businessType: "",
        currency: ""
    });

    useEffect(() => {
        if (store) {
            setFormData({
                name: store.name || "",
                phone: store.phone || "",
                address: store.address || "",
                city: store.city || "",
                district: store.district || "",
                ward: store.ward || "",
                businessType: store.businessType || "",
                currency: store.currency || ""
            });
        }
    }, [store]);
    const fetchStores = async () => {
        const storesData = await getStores(Number(user.id));
        dispatch(setStores(storesData));
        dispatch(setStore(storesData[0]));
    };
    const handleSave = async () => {
        try {
            // const response = await axios.put(`http://localhost:8080/v1/stores/${store.id}`, formData);
            await fetchStores();
            toast.success("Cập nhật thông tin cửa hàng thành công!");

        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi cập nhật cửa hàng!");
        }
    };
    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    return (
        <Box>
            <Header/>
            <MainBox>
                <Box sx={{padding: '0 200px'}}>
                    <Box className="titleHeader">Thông tin chi nhánh</Box>
                    <Box sx={{ display: 'flex', gap: 4, padding: '20px  30px', width: '100%' }}>
                        {/* Cột trái */}
                        <Box sx={{ flexBasis: '30%' }}>
                            <Typography fontWeight="bold">Thông tin chung</Typography>
                            <Typography fontSize={14} mt={1}>
                                Thông tin về cửa hàng, mô hình và lĩnh vực kinh doanh cửa hàng của bạn.
                            </Typography>
                            <Typography fontSize={14} mt={2} color="gray" fontStyle="italic">
                                Mã cửa hàng: <strong>{store?.id}</strong>
                            </Typography>
                        </Box>

                        {/* Cột phải */}
                        <Box sx={{ flexBasis: '70%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 1}}>

                                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        label="Tên cửa hàng (*)"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                    />
                                    <TextField
                                        label="Số điện thoại cửa hàng"
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        fullWidth
                                    />
                                </Box>

                                <TextField
                                    fullWidth
                                    multiline
                                    label="Địa chỉ (*)"
                                    value={formData.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    sx={{ mb: 2 }}
                                />

                                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Tỉnh / Thành phố (*)"
                                        value={formData.city}
                                        onChange={(e) => handleChange('city', e.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Quận / Huyện (*)"
                                        value={formData.district}
                                        onChange={(e) => handleChange('district', e.target.value)}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Phường / Xã (*)"
                                        value={formData.ward}
                                        onChange={(e) => handleChange('ward', e.target.value)}
                                    />
                                    <FormControl fullWidth>
                                        {/* Bạn có thể để trống hoặc thêm trường khác */}
                                    </FormControl>
                                </Box>
                            </Box>

                            <Box textAlign="right" mt={2}>
                                <Button variant="contained" color="primary" onClick={handleSave}>Lưu</Button>
                            </Box>
                        </Box>
                    </Box>

                </Box>
            </MainBox>
        </Box>
    )
}