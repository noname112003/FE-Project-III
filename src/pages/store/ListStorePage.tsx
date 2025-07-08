import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    CircularProgress, Button,
} from '@mui/material';
import Header from "../../components/layout/Header.tsx";
import MainBox from "../../components/layout/MainBox.tsx";

import {useNavigate} from "react-router-dom";
import {Add} from "@mui/icons-material";
import {getStoresV2} from "../../services/storeAPI.ts";
import {setStores} from "../../reducers/storesReducer.tsx";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
// export const IconBtnAddV2 = () => (
//     <svg
//         width="16"
//         height="16"
//         viewBox="0 0 16 16"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//     >
//         <path
//             d="M8.66667 4.66659H7.33333V7.33325H4.66667V8.66659H7.33333V11.3333H8.66667V8.66659H11.3333V7.33325H8.66667V4.66659ZM8 1.33325C4.32 1.33325 1.33333 4.31992 1.33333 7.99992C1.33333 11.6799 4.32 14.6666 8 14.6666C11.68 14.6666 14.6667 11.6799 14.6667 7.99992C14.6667 4.31992 11.68 1.33325 8 1.33325ZM8 13.3333C5.06 13.3333 2.66667 10.9399 2.66667 7.99992C2.66667 5.05992 5.06 2.66659 8 2.66659C10.94 2.66659 13.3333 5.05992 13.3333 7.99992C13.3333 10.9399 10.94 13.3333 8 13.3333Z"
//             fill={"white"}
//         />
//     </svg>
// );
interface Store {
    id: number;
    name: string;
    address: string;
    phone: string;
    status: boolean;
    city: string;
    district: string;
    ward: string;
    createdAt: number;
    modifiedOn: number;
}

const StoreList: React.FC = () => {
    const [listStores, setListStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
    const dispatch = useDispatch();
    // const store = useSelector((state: any) => state.storeSetting.store);
    useEffect(() => {
        const fetchStoresByUser = async () => {
            try {
                const response = await fetch(`http://localhost:8080/v1/stores/get_list_store?userId=${userId}`);
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || "Không thể lấy danh sách cửa hàng");
                }
                const data = await response.json();
                // localStorage.setItem("stores", JSON.stringify(data))
                setListStores(data);
            } catch (err: any) {
                setError(err.message || "Đã xảy ra lỗi.");
            } finally {
                setLoading(false);
            }
        };

        fetchStoresByUser();
    }, [userId]);

    // const renderStatusChip = (status: boolean) => {
    //     if (status) {
    //         return <Chip label="Đang hoạt động" color="success" />;
    //     } else {
    //         return <Chip label="Không hoạt động" color="error" />;
    //     }
    // };
    const renderStatusChip = (store: Store) => {
        const { status, id } = store;
        return (
            <Chip
                label={status ? "Đang hoạt động" : "Không hoạt động"}
                color={status ? "success" : "error"}
                onClick={() => handleToggleStatus(id, status)}
                sx={{ cursor: "pointer" }}
            />
        );
    };

    const handleToggleStatus = async (storeId: number, currentStatus: boolean) => {
        try {
            const response = await fetch(`http://localhost:8080/v1/stores/${storeId}/status?status=${!currentStatus}`, {
                method: 'PUT'
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Không thể cập nhật trạng thái cửa hàng");
            }

            // Cập nhật lại danh sách store tại local
            setListStores(prevStores =>
                prevStores.map(store =>
                    store.id === storeId ? { ...store, status: !currentStatus } : store
                )
            );
            const storesData = await getStoresV2(userId, true);  // Gọi API getStores với userId
            localStorage.setItem("stores", JSON.stringify(storesData));
            dispatch(setStores(storesData));

            // const currentStore = JSON.parse(localStorage.getItem("storze") || "{}"); // hoặc từ useSelector
            // if (currentStore?.id === storeId && currentStatus) {
            //     const newStore = storesData.length > 0 ? storesData[0] : null;
            //     if (newStore) {
            //         dispatch(setStore(newStore));
            //         localStorage.setItem("store", JSON.stringify(newStore));
            //     }
            // }
            toast.success(`Cập nhật trạng thái thành công!`);
        } catch (err: any) {
            setError(err.message || "Đã xảy ra lỗi khi cập nhật trạng thái.");
            toast.error("Lỗi khi cập nhật trạng thái!");
        }
    };


    return (
        <Box>
            <Header/>
            <MainBox>
                <Box  sx={{ margin: "24px", backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    {/*<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>*/}
                    {/*    Thông tin các chi nhánh*/}
                    {/*</Typography>*/}
                    <Box sx={{padding: "16px"}} display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Thông tin các chi nhánh
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                            onClick={() => navigate("/stores/create")}
                            sx={{ textTransform: "none" }}
                        >
                            Thêm cửa hàng
                        </Button>
                    </Box>
                    {loading ? (
                        <Box textAlign="center" py={4}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#333' }}><strong>Tên chi nhánh</strong></TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#333' }}><strong>Địa chỉ</strong></TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#333' }}><strong>Số điện thoại cừa hàng</strong></TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#333' }} align="center"><strong>Trạng thái</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listStores.map((store) => (
                                    <TableRow
                                        key={store.id}
                                        sx={{// Hover effect
                                        cursor: 'pointer'
                                        }}
                                    hover>
                                        <TableCell>{store.name}</TableCell>
                                        <TableCell>
                                            {[store.address, store.ward, store.district, store.city]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </TableCell>
                                        <TableCell>{store.phone}</TableCell>
                                        <TableCell align="center">{renderStatusChip(store)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Box>
            </MainBox>
        </Box>

    );
};

export default StoreList;
