import {
    Box,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Paper,
} from "@mui/material";
import MainBox from "../../../components/layout/MainBox";
import { Add } from "@mui/icons-material";
import BrandPageAppBar from "./BrandPageAppBar";
import { useEffect, useState } from "react";
import {
    BrandResponse,
    initialCategoryOrBrandResponse,
} from "../../../models/ProductInterface";
import SearchField from "../SearchField";
import { getListOfBrands, getNumberOfBrands } from "../../../services/brandAPI";
import UpdateBrand from "./UpdateBrand";
import AddBrand from "./AddBrand";
import { formatDate } from "../../../utils/formatDate";

type Props = {};

export default function BrandPage({}: Props) {
    const [data, setData] = useState<BrandResponse[]>([]);
    const [numberOfBrands, setNumberOfBrands] = useState(0);
    const [query, setQuery] = useState("");
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [isUpdate, setIsUpdate] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedBrand, setSelectedBrand] = useState<BrandResponse>(
        initialCategoryOrBrandResponse
    );
    function handlePaginationChange(
        _e: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) {
        setPaginationModel((prev) => ({ ...prev, page: newPage }));
    }

    function handlePageSizeChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPaginationModel((prev) => ({
            ...prev,
            pageSize: parseInt(e.target.value, 10),
        }));
    }

    function updateListOfBrands() {
        getNumberOfBrands(query).then((res) => {
            setNumberOfBrands(res);
        });
        getListOfBrands(
            paginationModel.page,
            paginationModel.pageSize,
            query
        ).then((res) => {
            setData(res);
        });
    }
    function handleRowClick(row: BrandResponse) {
        setIsUpdate(true);
        setSelectedBrand(row);
    }

    useEffect(() => {
        getListOfBrands(
            paginationModel.page,
            paginationModel.pageSize,
            query
        ).then((res) => {
            setData(res);
        });
    }, [paginationModel.pageSize, paginationModel.page]);

    useEffect(() => {
        getNumberOfBrands(query).then((res) => {
            setNumberOfBrands(res);
        });
        getListOfBrands(paginationModel.page, paginationModel.pageSize, query)
            .then((res) => {
                setData(res);
            })
            .finally(() => setLoading(false));
    }, [query]);
    return (
        <Box>
            <BrandPageAppBar />
            <MainBox>
                <Box sx={{ padding: "20px 24px", backgroundColor: "#F0F1F1" }}>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            padding: "11px 0",
                            height: "38px",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography sx={{ fontSize: "20px" }}>
                            Nhãn hiệu
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            sx={{ textTransform: "none" }}
                            onClick={() => setIsAdd(true)}
                        >
                            Thêm nhãn hiệu
                        </Button>
                    </Box>
                    <Box sx={{ backgroundColor: "white", padding: "16px" }}>
                        <SearchField
                            onKeyPress={setQuery}
                            placeHolder="Tìm kiếm nhãn hiệu theo tên "
                        />
                        <TableContainer component={Paper} sx={{ mt: "16px" }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Mã loại</TableCell>
                                        <TableCell>Tên nhãn hiệu</TableCell>
                                        <TableCell>Ghi chú</TableCell>
                                        <TableCell>Ngày khởi tạo</TableCell>
                                        <TableCell>
                                            Ngày cập nhật cuối
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
                                                hover
                                                key={row.id}
                                                style={{ cursor: "pointer" }}
                                                onClick={() =>
                                                    handleRowClick(row)
                                                }
                                            >
                                                <TableCell
                                                    style={{ color: "#08f" }}
                                                >
                                                    {row.code}
                                                </TableCell>
                                                <TableCell>
                                                    {row.name}
                                                </TableCell>
                                                <TableCell>
                                                    {row.description}
                                                </TableCell>

                                                <TableCell>
                                                    {formatDate(
                                                        row.createdOn.toString()
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(
                                                        row.updatedOn.toString()
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={numberOfBrands}
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
            {isUpdate ? (
                <UpdateBrand
                    setIsUpdate={setIsUpdate}
                    selectedBrand={selectedBrand}
                    onUpdate={updateListOfBrands}
                />
            ) : (
                <></>
            )}
            {isAdd ? (
                <AddBrand setIsAdd={setIsAdd} onUpdate={updateListOfBrands} />
            ) : (
                <></>
            )}
        </Box>
    );
}
