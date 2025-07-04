import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import MainBox from "../../components/layout/MainBox";
import { Image } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import SearchField from "./SearchField";
import { useNavigate } from "react-router-dom";
import {
    getListOfProducts,
    getNumberOfProducts,
} from "../../services/productAPI";
import { ProductResponse } from "../../models/ProductInterface";
import { formatDate } from "../../utils/formatDate";
import "../styles.css";
import Header from "../../components/layout/Header.tsx";
import {useSelector} from "react-redux";
type Props = {};

export default function ProductPageV2({}: Props) {
    const [data, setData] = useState<ProductResponse[]>([]);
    const [numberOfProducts, setNumberOfProducts] = useState<number>(0);
    const [query, setQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const navigate = useNavigate();
    const store = useSelector((state: any) => state.storeSetting.store);

    function handlePaginationChange(
        _e: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) {
        setLoading(true);
        setPaginationModel((prev) => ({ ...prev, page: newPage }));
    }

    function handlePageSizeChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPaginationModel((prev) => ({
            ...prev,
            pageSize: parseInt(e.target.value, 10),
        }));
    }

    useEffect(() => {
        if(store) {
            getNumberOfProducts(query).then((res) => {
                setNumberOfProducts(res);
            });
            getListOfProducts(paginationModel.page, paginationModel.pageSize, query, store.id)
                .then((res) => {
                    setData(res);
                })
                .finally(() => setLoading(false));
        }

    }, [paginationModel.pageSize, paginationModel.page, query, store]);


    return (
        <Box>
            <Header/>
            <MainBox>
                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                    <Box className="titleHeader">Danh sách sản phẩm</Box>
                    {/*<Box*/}
                    {/*    sx={{*/}
                    {/*        padding: "20px 30px",*/}
                    {/*        height: "38px",*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <Button*/}
                    {/*        variant="contained"*/}
                    {/*        startIcon={<Add />}*/}
                    {/*        sx={{ textTransform: "none" }}*/}
                    {/*        onClick={() => navigate("/products/create")}*/}
                    {/*    >*/}
                    {/*        Thêm sản phẩm*/}
                    {/*    </Button>*/}
                    {/*</Box>*/}
                </Box>
                <Box sx={{ padding: "20px 24px", backgroundColor: "#F0F1F1" }}>
                    <Box sx={{ backgroundColor: "white", padding: "16px" }}>
                        <SearchField
                            onKeyPress={setQuery}
                            placeHolder="Tìm kiếm sản phẩm theo tên"
                        />
                        <TableContainer component={Paper} sx={{ mt: "16px" }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: "8%" }}>
                                            Ảnh
                                        </TableCell>
                                        <TableCell style={{ width: "22%" }}>
                                            Tên sản phẩm
                                        </TableCell>
                                        <TableCell style={{ width: "15%" }}>
                                            Loại
                                        </TableCell>
                                        <TableCell style={{ width: "15%" }}>
                                            Nhãn hiệu
                                        </TableCell>
                                        <TableCell style={{ width: "10px" }}>
                                            Tồn kho tổng
                                        </TableCell>
                                        <TableCell style={{ width: "15%" }}>
                                            Ngày khởi tạo
                                        </TableCell>
                                        <TableCell style={{ width: "15%" }}>
                                            Ngày cập nhật
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
                                            <TableRow
                                                key={row.id}
                                                hover
                                                style={{ cursor: "pointer" }}
                                                onClick={() =>
                                                    navigate(
                                                        `/warehouse/products/${row.id}`
                                                    )
                                                }
                                            >
                                                <TableCell>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "center",
                                                            alignItems:
                                                                "center",
                                                            height: "100%",
                                                        }}
                                                    >
                                                        {row.imagePath.length >
                                                        0 ? (
                                                            <img
                                                                src={
                                                                    row
                                                                        .imagePath[0]
                                                                }
                                                                alt="Product"
                                                                style={{
                                                                    width: 30,
                                                                    height: 30,
                                                                }}
                                                            />
                                                        ) : (
                                                            <Image
                                                                color="disabled"
                                                                style={{
                                                                    width: 30,
                                                                    height: 30,
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {row.name}
                                                </TableCell>
                                                <TableCell>
                                                    {row.categoryName}
                                                </TableCell>
                                                <TableCell>
                                                    {row.brandName}
                                                </TableCell>
                                                <TableCell>
                                                    {/*{row.variants?.reduce((total, variant) => {*/}
                                                    {/*    return (*/}
                                                    {/*        total +*/}
                                                    {/*        (variant.variantStores?.reduce((sum, store) => sum + (store.quantity || 0), 0) || 0)*/}
                                                    {/*    );*/}
                                                    {/*}, 0) ?? 0}*/}
                                                    {row.stock}
                                                </TableCell>
                                                <TableCell>
                                                    {row.createdOn ? formatDate(row.createdOn.toString()) : "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {row.updatedOn ? formatDate(row.updatedOn.toString()) : "N/A"}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={numberOfProducts}
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
