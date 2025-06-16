import {
    Box, FormControl, InputLabel, MenuItem,
    Paper, Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import MainBox from "../../../components/layout/MainBox";
import { Image } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchField from "../SearchField";
import {
    getListOfVariants,
    getNumberOfVariants,
} from "../../../services/productAPI";
import { VariantResponse } from "../../../models/ProductInterface";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import Header from "../../../components/layout/Header.tsx";
import {useSelector} from "react-redux";


export default function VariantPage() {
    const [data, setData] = useState<VariantResponse[]>([]);
    const [numberOfVariants, setNumberOfVariants] = useState<number>(0);
    const [query, setQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const store = useSelector((state: any) => state.storeSetting.store);
    const storeList = useSelector((state: any) => state.stores.stores)
    const [selectedStoreId, setSelectedStoreId] = useState<any>(store?.id || "all");
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const navigate = useNavigate();
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    function handlePaginationChange(
        _e: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) {
        setLoading(true);
        setPaginationModel((prev) => ({ ...prev, page: newPage }));
    }
    const toggleRowExpansion = (id: number) => {
        setExpandedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    function handlePageSizeChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPaginationModel((prev) => ({
            ...prev,
            pageSize: parseInt(e.target.value, 10),
        }));
    }

    useEffect(() => {
        if (selectedStoreId === "all") {
            getNumberOfVariants(query).then((res) => setNumberOfVariants(res));
            getListOfVariants(paginationModel.page, paginationModel.pageSize, query, null)
                .then((res) => setData(res))
                .finally(() => setLoading(false));

        } else if (selectedStoreId) {
            getNumberOfVariants(query).then((res) => setNumberOfVariants(res));
            getListOfVariants(paginationModel.page, paginationModel.pageSize, query, selectedStoreId)
                .then((res) => setData(res))
                .finally(() => setLoading(false));
        }
    }, [paginationModel.pageSize, paginationModel.page, query, store, selectedStoreId]);


    return (
        <Box>
            <Header/>
            <MainBox>
                <Box className="titleHeader">Danh sách phiên bản</Box>
                <Box sx={{ padding: "20px 24px", backgroundColor: "#F0F1F1" }}>
                    <Box sx={{ backgroundColor: "white", padding: "16px" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                            <FormControl sx={{ minWidth: 250 }}>
                                <InputLabel>Chọn nhà hàng</InputLabel>
                                <Select
                                    label="Chọn nhà hàng"
                                    value={selectedStoreId || "all"}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedStoreId(value === "all" ? "all" : value);
                                        setPaginationModel({ page: 0, pageSize: 10 });
                                        setExpandedRows([]);
                                        setLoading(true);
                                    }}
                                >
                                    <MenuItem value="all">Tất cả nhà hàng</MenuItem>
                                    {storeList.map((s) => (
                                        <MenuItem key={s.id} value={s.id}>
                                            {s.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Box sx={{ flex: 1 }}>
                                <SearchField
                                    onKeyPress={setQuery}
                                    placeHolder="Tìm kiếm phiên bản theo tên hoặc mã SKU"
                                />
                            </Box>
                        </Box>
                        <TableContainer component={Paper} sx={{ mt: "16px" }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: "8%" }}>
                                            Ảnh
                                        </TableCell>
                                        <TableCell style={{ width: "10%" }}>
                                            Mã SKU
                                        </TableCell>
                                        <TableCell style={{ width: "25%" }}>
                                            Tên phiên bản
                                        </TableCell>
                                        <TableCell style={{ width: "10%" }}>
                                            Tồn kho
                                        </TableCell>
                                        <TableCell style={{ width: "15%" }}>
                                            Ngày khởi tạo
                                        </TableCell>
                                        <TableCell
                                            style={{ width: "15%" }}
                                            align="right"
                                        >
                                            Giá bán
                                        </TableCell>
                                        <TableCell
                                            style={{ width: "15%" }}
                                            align="right"
                                        >
                                            Giá nhập
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                align="center"
                                            >
                                                Đang tải dữ liệu...
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        data.map((row) => (
                                            <React.Fragment key={row.id}>
                                                <TableRow
                                                    hover
                                                    style={{ cursor: selectedStoreId === "all" ? "pointer" : "default" }}
                                                    onClick={() =>
                                                        selectedStoreId === "all"
                                                            ? toggleRowExpansion(row.id)
                                                            : navigate(`/products/${row.productId}`)
                                                    }
                                                >
                                                    <TableCell>
                                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                            {row.imagePath.length > 0 ? (
                                                                <img src={row.imagePath} alt="Product" style={{ width: 30, height: 30 }} />
                                                            ) : (
                                                                <Image color="disabled" style={{ width: 30, height: 30 }} />
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell style={{ color: "#08f" }}>{row.sku}</TableCell>
                                                    <TableCell>{row.name}</TableCell>
                                                    <TableCell>
                                                        {selectedStoreId === "all"
                                                            ? row.quantity
                                                            : row.variantStores.find(vs => vs.storeId === Number(selectedStoreId))?.quantity || 0}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.createdOn ? formatDate(row.createdOn.toString()) : "N/A"}
                                                    </TableCell>
                                                    <TableCell align="right">{formatCurrency(row.priceForSale)}</TableCell>
                                                    <TableCell align="right">{formatCurrency(row.initialPrice)}</TableCell>
                                                </TableRow>

                                                {selectedStoreId === "all" && expandedRows.includes(row.id) && (
                                                    <TableRow>
                                                        <TableCell colSpan={7} style={{ backgroundColor: "#f9f9f9" }}>
                                                            <Box sx={{ pl: 4 }}>
                                                                <b>Chi tiết tồn kho theo cửa hàng:</b>
                                                                <ul style={{marginTop: 8}}>
                                                                    {row.variantStores.map((vs) => {
                                                                        const storeName =
                                                                            storeList.find((s) => s.id === vs.storeId)?.name ||
                                                                            `Store ${vs.storeId}`;
                                                                        return (
                                                                            <li key={vs.storeId}>
                                                                                {storeName}: <b>{vs.quantity}</b>
                                                                            </li>
                                                                        );
                                                                    })}
                                                                    <li style={{
                                                                        fontStyle: "italic",
                                                                        marginTop: 6,
                                                                        color: "#444"
                                                                    }}>
                                                                        Kho tổng (chưa phân bổ):{" "}
                                                                        <b>
                                                                            {
                                                                                row.quantity -
                                                                                row.variantStores.reduce((sum, vs) => sum + vs.quantity, 0)
                                                                            }
                                                                        </b>
                                                                    </li>
                                                                </ul>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={numberOfVariants}
                                page={paginationModel.page}
                                onPageChange={handlePaginationChange}
                                rowsPerPage={paginationModel.pageSize}
                                onRowsPerPageChange={handlePageSizeChange}
                                rowsPerPageOptions={[10, 20, 30]}
                                labelRowsPerPage="Số hàng trên mỗi trang"
                                labelDisplayedRows={({ from, to, count }) =>
                                    `${from}-${to} trong tổng số ${count}`
                                }
                            />
                        </TableContainer>
                    </Box>
                </Box>
            </MainBox>
        </Box>
    );
}
