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
import MainBox from "../../../components/layout/MainBox";
import { Image } from "@mui/icons-material";
import VariantPageAppBar from "./VariantPageAppBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchField from "../SearchField";
import {
    getListOfVariants,
    getNumberOfVariants,
} from "../../../services/productAPI";
import { VariantResponse } from "../../../models/ProductInterface";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";

type Props = {};

export default function VariantPage({}: Props) {
    const [data, setData] = useState<VariantResponse[]>([]);
    const [numberOfVariants, setNumberOfVariants] = useState<number>(0);
    const [query, setQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const navigate = useNavigate();

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
        getNumberOfVariants(query).then((res) => {
            setNumberOfVariants(res);
        });
        getListOfVariants(paginationModel.page, paginationModel.pageSize, query)
            .then((res) => {
                setData(res);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        getListOfVariants(paginationModel.page, paginationModel.pageSize, query)
            .then((res) => {
                setData(res);
            })
            .finally(() => setLoading(false));
    }, [paginationModel.pageSize, paginationModel.page]);

    useEffect(() => {
        getNumberOfVariants(query).then((res) => {
            setNumberOfVariants(res);
        });
        getListOfVariants(
            paginationModel.page,
            paginationModel.pageSize,
            query
        ).then((res) => {
            setData(res);
        });
    }, [query]);

    return (
        <Box>
            <VariantPageAppBar />
            <MainBox>
                <Box sx={{ padding: "20px 24px", backgroundColor: "#F0F1F1" }}>
                    <Box sx={{ backgroundColor: "white", padding: "16px" }}>
                        <SearchField
                            onKeyPress={setQuery}
                            placeHolder="Tìm kiếm phiên bản theo tên hoặc mã SKU"
                        />
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
                                            <TableRow
                                                key={row.id}
                                                hover
                                                style={{ cursor: "pointer" }}
                                                onClick={() =>
                                                    navigate(
                                                        `/products/${row.productId}`
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
                                                                    row.imagePath
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
                                                <TableCell
                                                    style={{ color: "#08f" }}
                                                >
                                                    {row.sku}
                                                </TableCell>
                                                <TableCell>
                                                    {row.name}
                                                </TableCell>
                                                <TableCell>
                                                    {row.quantity}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(
                                                        row.createdOn.toString()
                                                    )}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {formatCurrency(
                                                        row.priceForSale
                                                    )}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {formatCurrency(
                                                        row.initialPrice
                                                    )}
                                                </TableCell>
                                            </TableRow>
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
