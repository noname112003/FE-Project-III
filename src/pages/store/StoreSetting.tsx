// // import {
// //     Box, Button, FormControl,
// //     TextField,
// //     Typography
// // } from "@mui/material"
// // import MainBox from "../../components/layout/MainBox"
// // import  { useEffect, useState } from "react";
// //
// // import Header from "../../components/layout/Header.tsx";
// // import  "../styles.css"
// // import { useSelector} from "react-redux";
// // import {toast} from "react-toastify";
// //
// //
// // export default function StoreSetting() {
// //     const store = useSelector((state: any) => state.storeSetting.store);
// //     // const user = JSON.parse(localStorage.getItem("user") as string);
// //     // const dispatch = useDispatch();
// //
// //     const [formData, setFormData] = useState({
// //         name: "",
// //         phone: "",
// //         address: "",
// //         city: "",
// //         district: "",
// //         ward: "",
// //         businessType: "",
// //         currency: "",
// //         status: true
// //     });
// //
// //     useEffect(() => {
// //         if (store) {
// //             setFormData({
// //                 name: store.name || "",
// //                 phone: store.phone || "",
// //                 address: store.address || "",
// //                 city: store.city || "",
// //                 district: store.district || "",
// //                 ward: store.ward || "",
// //                 businessType: store.businessType || "",
// //                 currency: store.currency || "",
// //                 status: true
// //             });
// //         }
// //     }, [store]);
// //     const updateStore = async (storeId: number, storeData: any) => {
// //         const response = await fetch(`http://localhost:8080/v1/stores/${storeId}`, {
// //             method: "PUT",
// //             headers: {
// //                 "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify(storeData),
// //         });
// //
// //         if (!response.ok) {
// //             const errData = await response.json();
// //             throw new Error(errData.message || "Cập nhật cửa hàng thất bại");
// //         }
// //
// //         return response.json(); // Trả về dữ liệu mới sau khi cập nhật
// //     };
// //     // const fetchStores = async () => {
// //     //     const storesData = await getStores(Number(user.id));
// //     //     dispatch(setStores(storesData));
// //     //     dispatch(setStore(storesData[0]));
// //     // };
// //     const handleSave = async () => {
// //         try {
// //             // const response = await axios.put(`http://localhost:8080/v1/stores/${store.id}`, formData);
// //             // await fetchStores();
// //             await updateStore(store.id, formData);
// //             toast.success("Cập nhật thông tin cửa hàng thành công!");
// //
// //         } catch (error) {
// //             console.error(error);
// //             toast.error("Lỗi khi cập nhật cửa hàng!");
// //         }
// //     };
// //     const handleChange = (field: string, value: string) => {
// //         setFormData(prev => ({ ...prev, [field]: value }));
// //     };
// //     return (
// //         <Box>
// //             <Header/>
// //             <MainBox>
// //                 <Box sx={{padding: '0 200px'}}>
// //                     <Box className="titleHeader">Thông tin chi nhánh</Box>
// //                     <Box sx={{ display: 'flex', gap: 4, padding: '20px  30px', width: '100%' }}>
// //                         {/* Cột trái */}
// //                         <Box sx={{ flexBasis: '30%' }}>
// //                             <Typography fontWeight="bold">Thông tin chung</Typography>
// //                             <Typography fontSize={14} mt={1}>
// //                                 Thông tin về cửa hàng, mô hình và lĩnh vực kinh doanh cửa hàng của bạn.
// //                             </Typography>
// //                             <Typography fontSize={14} mt={2} color="gray" fontStyle="italic">
// //                                 Mã cửa hàng: <strong>{store?.id}</strong>
// //                             </Typography>
// //                         </Box>
// //
// //                         {/* Cột phải */}
// //                         <Box sx={{ flexBasis: '70%', display: 'flex', flexDirection: 'column', gap: 2 }}>
// //                             <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 1}}>
// //
// //                                 <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
// //                                     <TextField
// //                                         fullWidth
// //                                         multiline
// //                                         label="Tên cửa hàng (*)"
// //                                         value={formData.name}
// //                                         onChange={(e) => handleChange('name', e.target.value)}
// //                                     />
// //                                     <TextField
// //                                         label="Số điện thoại cửa hàng"
// //                                         value={formData.phone}
// //                                         onChange={(e) => handleChange('phone', e.target.value)}
// //                                         fullWidth
// //                                     />
// //                                 </Box>
// //
// //                                 <TextField
// //                                     fullWidth
// //                                     multiline
// //                                     label="Địa chỉ (*)"
// //                                     value={formData.address}
// //                                     onChange={(e) => handleChange('address', e.target.value)}
// //                                     sx={{ mb: 2 }}
// //                                 />
// //
// //                                 <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
// //                                     <TextField
// //                                         fullWidth
// //                                         label="Tỉnh / Thành phố (*)"
// //                                         value={formData.city}
// //                                         onChange={(e) => handleChange('city', e.target.value)}
// //                                     />
// //                                     <TextField
// //                                         fullWidth
// //                                         label="Quận / Huyện (*)"
// //                                         value={formData.district}
// //                                         onChange={(e) => handleChange('district', e.target.value)}
// //                                     />
// //                                 </Box>
// //
// //                                 <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
// //                                     <TextField
// //                                         fullWidth
// //                                         label="Phường / Xã (*)"
// //                                         value={formData.ward}
// //                                         onChange={(e) => handleChange('ward', e.target.value)}
// //                                     />
// //                                     <FormControl fullWidth>
// //                                         {/* Bạn có thể để trống hoặc thêm trường khác */}
// //                                     </FormControl>
// //                                 </Box>
// //                             </Box>
// //
// //                             <Box textAlign="right" mt={2}>
// //                                 <Button variant="contained" color="primary" onClick={handleSave}>Lưu</Button>
// //                             </Box>
// //                         </Box>
// //                     </Box>
// //
// //                 </Box>
// //             </MainBox>
// //         </Box>
// //     )
// // }
//
//
// import {
//     Box, Button, FormControl, InputLabel, MenuItem,
//     Select, TextField, Typography
// } from "@mui/material";
// import MainBox from "../../components/layout/MainBox";
// import Header from "../../components/layout/Header";
// import "../styles.css";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
//
// export default function StoreSetting() {
//     const store = useSelector((state: any) => state.storeSetting.store);
//
//     const initialData = {
//         name: "",
//         phone: "",
//         address: "",
//         city: "",
//         district: "",
//         ward: "",
//         businessType: "",
//         currency: "",
//         status: true
//     };
//
//     const [formData, setFormData] = useState(initialData);
//     const [oldData, setOldData] = useState(initialData);
//     const [provinces, setProvinces] = useState<any[]>([]);
//     const [districts, setDistricts] = useState<any[]>([]);
//     const [wards, setWards] = useState<any[]>([]);
//     const [error, setError] = useState("");
//
//     useEffect(() => {
//         if (store) {
//             setFormData({
//                 name: store.name || "",
//                 phone: store.phone || "",
//                 address: store.address || "",
//                 city: store.city || "",
//                 district: store.district || "",
//                 ward: store.ward || "",
//                 businessType: store.businessType || "",
//                 currency: store.currency || "",
//                 status: true
//             });
//             setOldData({
//                 name: store.name || "",
//                 phone: store.phone || "",
//                 address: store.address || "",
//                 city: store.city || "",
//                 district: store.district || "",
//                 ward: store.ward || "",
//                 businessType: store.businessType || "",
//                 currency: store.currency || "",
//                 status: true
//             });
//         }
//     }, [store]);
//
//     // Load tỉnh/thành
//     useEffect(() => {
//         fetch("https://provinces.open-api.vn/api/?depth=1")
//             .then(res => res.json())
//             .then(data => setProvinces(data))
//             .catch(() => setError("Không thể tải danh sách tỉnh/thành."));
//     }, []);
//
//     // Load quận/huyện theo tỉnh
//     useEffect(() => {
//         if (formData.city) {
//             const selectedProvince = provinces.find(p => p.name === formData.city);
//             if (selectedProvince) {
//                 fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
//                     .then(res => res.json())
//                     .then(data => setDistricts(data.districts || []))
//                     .catch(() => setError("Không thể tải danh sách quận/huyện."));
//             }
//         } else {
//             setDistricts([]);
//             setWards([]);
//         }
//     }, [formData.city]);
//
//     // Load phường/xã theo quận
//     useEffect(() => {
//         if (formData.district ) {
//             const selectedDistrict = districts.find(d => d.name === formData.district);
//             if (selectedDistrict) {
//                 fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
//                     .then(res => res.json())
//                     .then(data => setWards(data.wards || []))
//                     .catch(() => setError("Không thể tải danh sách phường/xã."));
//             }
//         } else {
//             setWards([]);
//         }
//     }, [ formData.district]);
//
//     const handleChange = (field: string, value: string) => {
//         setFormData(prev => ({ ...prev, [field]: value }));
//     };
//
//     const updateStore = async (storeId: number, storeData: any) => {
//         const response = await fetch(`http://localhost:8080/v1/stores/${storeId}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(storeData),
//         });
//
//         if (!response.ok) {
//             const errData = await response.json();
//             throw new Error(errData.message || "Cập nhật cửa hàng thất bại");
//         }
//
//         return response.json();
//     };
//
//     const handleSave = async () => {
//         try {
//             await updateStore(store.id, formData);
//             // setOldData({ ...formData });
//             toast.success("Cập nhật thông tin cửa hàng thành công!");
//         } catch (error) {
//             console.error(error);
//             toast.error("Lỗi khi cập nhật cửa hàng!");
//         }
//     };
//     const isChanged = () => {
//         if (!store) return false;
//         return (
//             formData.name !== oldData.name ||
//             formData.phone !== oldData.phone ||
//             formData.address !== oldData.address ||
//             formData.city !== oldData.city ||
//             formData.district !== oldData.district ||
//             formData.ward !== oldData.ward
//         );
//     };
//
//
//     const handleCancel = () => {
//         setFormData({
//             name: store.name || "",
//             phone: store.phone || "",
//             address: store.address || "",
//             city: store.city || "",
//             district: store.district || "",
//             ward: store.ward || "",
//             businessType: store.businessType || "",
//             currency: store.currency || "",
//             status: true
//         });
//     };
//
//     return (
//         <Box>
//             <Header />
//             <MainBox>
//                 <Box sx={{ padding: '0 200px' }}>
//                     <Box className="titleHeader">Thông tin chi nhánh</Box>
//                     <Box sx={{ display: 'flex', gap: 4, padding: '20px  30px', width: '100%' }}>
//                         <Box sx={{ flexBasis: '30%' }}>
//                             <Typography fontWeight="bold">Thông tin chung</Typography>
//                             <Typography fontSize={14} mt={1}>
//                                 Thông tin về cửa hàng, mô hình và lĩnh vực kinh doanh cửa hàng của bạn.
//                             </Typography>
//                             <Typography fontSize={14} mt={2} color="gray" fontStyle="italic">
//                                 Mã cửa hàng: <strong>{store?.id}</strong>
//                             </Typography>
//                         </Box>
//
//                         <Box sx={{ flexBasis: '70%', display: 'flex', flexDirection: 'column', gap: 2 }}>
//                             <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 1 }}>
//                                 <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
//                                     <TextField
//                                         fullWidth
//                                         label="Tên cửa hàng (*)"
//                                         value={formData.name}
//                                         onChange={(e) => handleChange('name', e.target.value)}
//                                     />
//                                     <TextField
//                                         fullWidth
//                                         label="Số điện thoại cửa hàng"
//                                         value={formData.phone}
//                                         onChange={(e) => handleChange('phone', e.target.value)}
//                                     />
//                                 </Box>
//
//                                 <TextField
//                                     fullWidth
//                                     multiline
//                                     label="Địa chỉ (*)"
//                                     value={formData.address}
//                                     onChange={(e) => handleChange('address', e.target.value)}
//                                     sx={{ mb: 2 }}
//                                 />
//
//                                 <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
//                                     <FormControl fullWidth>
//                                         <InputLabel>Tỉnh / Thành phố</InputLabel>
//                                         <Select
//                                             value={formData.city}
//                                             label="Tỉnh / Thành phố"
//                                             onChange={(e) => handleChange('city', e.target.value)}
//                                         >
//                                             {provinces.map((province) => (
//                                                 <MenuItem key={province.code} value={province.name}>
//                                                     {province.name}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                     </FormControl>
//
//                                     <FormControl fullWidth>
//                                         <InputLabel>Quận / Huyện</InputLabel>
//                                         <Select
//                                             value={formData.district}
//                                             label="Quận / Huyện"
//                                             onChange={(e) => handleChange('district', e.target.value)}
//                                             disabled={!formData.city}
//                                         >
//                                             {districts.map((d) => (
//                                                 <MenuItem key={d.code} value={d.name}>
//                                                     {d.name}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                     </FormControl>
//                                 </Box>
//
//                                 <FormControl fullWidth sx={{ mb: 2 }}>
//                                     <InputLabel>Phường / Xã</InputLabel>
//                                     <Select
//                                         value={formData.ward}
//                                         label="Phường / Xã"
//                                         onChange={(e) => handleChange('ward', e.target.value)}
//                                         disabled={!formData.district}
//                                     >
//                                         {wards.map((w) => (
//                                             <MenuItem key={w.code} value={w.name}>
//                                                 {w.name}
//                                             </MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>
//                                 {error && (
//                                     <Typography color="error" sx={{ mt: 2, ml: 2 }}>
//                                         {error}
//                                     </Typography>
//                                 )}
//                             </Box>
//
//                             <Box textAlign="right" mt={2}>
//                                 <Button
//                                     variant="outlined"
//                                     color="inherit"
//                                     onClick={handleCancel}
//                                     sx={{ mr: 2 }}
//                                     disabled={!isChanged()} // Chỉ bật khi có thay đổi
//                                 >
//                                     Huỷ
//                                 </Button>
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     onClick={handleSave}
//                                     disabled={!isChanged()} // Chỉ bật khi có thay đổi
//                                 >
//                                     Lưu
//                                 </Button>
//                             </Box>
//                         </Box>
//                     </Box>
//                 </Box>
//             </MainBox>
//         </Box>
//     );
// }

import {
    Box, Button, TextField, Typography
} from "@mui/material";
import MainBox from "../../components/layout/MainBox";
import Header from "../../components/layout/Header";
import "../styles.css";
import { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import { toast } from "react-toastify";
import {setStores} from "../../reducers/storesReducer.tsx";
import {setStore} from "../../reducers/storeSettingReducer.tsx";

export default function StoreSetting() {
    const store = useSelector((state: any) => state.storeSetting.store);
    const stores = useSelector((state: any) => state.stores.stores);
    // const user = JSON.parse(localStorage.getItem("user") as string);

    const initialData = {
        name: "",
        phone: "",
        address: "",
        city: "",
        district: "",
        ward: "",
        businessType: "",
        currency: "",
        status: true
    };
    const dispatch = useDispatch();

    const [formData, setFormData] = useState(initialData);
    const [oldData, setOldData] = useState(initialData);

    useEffect(() => {
        if (store) {
            const loadedData = {
                name: store.name || "",
                phone: store.phone || "",
                address: store.address || "",
                city: store.city || "",
                district: store.district || "",
                ward: store.ward || "",
                businessType: store.businessType || "",
                currency: store.currency || "",
                status: true
            };
            setFormData(loadedData);
            setOldData(loadedData);
        }
    }, [store]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateStore = async (storeId: number, storeData: any) => {
        const response = await fetch(`http://localhost:8080/v1/stores/${storeId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(storeData),
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || "Cập nhật cửa hàng thất bại");
        }

        return response.json();
    };
    const getStoreById = async (storeId: number) => {
        const response = await fetch(`http://localhost:8080/v1/stores/${storeId}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Không thể lấy thông tin cửa hàng");
        }
        return await response.json();
    };
    const handleSave = async () => {
        try {
            await updateStore(store.id, formData);
            const updatedStore = await getStoreById(store.id);
            dispatch(setStore(updatedStore));
            dispatch(setStores(
                stores.map((s: { id: number }) => s.id === updatedStore.id ? updatedStore : s)
            ));
            toast.success("Cập nhật thông tin cửa hàng thành công!");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi cập nhật cửa hàng!");
        }
    };

    const isChanged = () => {
        if (!store) return false;
        return (
            formData.name !== oldData.name ||
            formData.phone !== oldData.phone ||
            formData.address !== oldData.address ||
            formData.city !== oldData.city ||
            formData.district !== oldData.district ||
            formData.ward !== oldData.ward
        );
    };

    const handleCancel = () => {
        setFormData({ ...oldData });
    };

    return (
        <Box>
            <Header />
            <MainBox>
                <Box sx={{ padding: '0 200px' }}>
                    <Box className="titleHeader">Thông tin chi nhánh</Box>
                    <Box sx={{ display: 'flex', gap: 4, padding: '20px  30px', width: '100%' }}>
                        <Box sx={{ flexBasis: '30%' }}>
                            <Typography fontWeight="bold">Thông tin chung</Typography>
                            <Typography fontSize={14} mt={1}>
                                Thông tin về cửa hàng, mô hình và lĩnh vực kinh doanh cửa hàng của bạn.
                            </Typography>
                            <Typography fontSize={14} mt={2} color="gray" fontStyle="italic">
                                Mã cửa hàng: <strong>{store?.id}</strong>
                            </Typography>
                        </Box>

                        <Box sx={{ flexBasis: '70%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 1 }}>
                                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Tên cửa hàng (*)"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Số điện thoại cửa hàng"
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
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
                                        label="Tỉnh / Thành phố"
                                        value={formData.city}
                                        onChange={(e) => handleChange('city', e.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Quận / Huyện"
                                        value={formData.district}
                                        onChange={(e) => handleChange('district', e.target.value)}
                                    />
                                </Box>

                                <TextField
                                    fullWidth
                                    label="Phường / Xã"
                                    value={formData.ward}
                                    onChange={(e) => handleChange('ward', e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                            </Box>

                            <Box textAlign="right" mt={2}>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={handleCancel}
                                    sx={{ mr: 2 }}
                                    disabled={!isChanged()}
                                >
                                    Huỷ
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSave}
                                    disabled={!isChanged()}
                                >
                                    Lưu
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </MainBox>
        </Box>
    );
}
