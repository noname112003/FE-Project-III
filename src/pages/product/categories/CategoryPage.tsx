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
import CategoryPageAppBar from "./CategoryPageAppBar";
import { useEffect, useState } from "react";
import {
    CategoryResponse,
    initialCategoryOrBrandResponse,
} from "../../../models/ProductInterface";
import SearchField from "../SearchField";
import {
    getListOfCategories,
    getNumberOfCategories,
} from "../../../services/categoryAPI";
import AddCategory from "./AddCategory";
import UpdateCategory from "./UpdateCategory";
import { formatDate } from "../../../utils/formatDate";

type Props = {};

export default function CategoryPage({}: Props) {
    const [data, setData] = useState<CategoryResponse[]>([]);
    const [numberOfCategories, setNumberOfCategories] = useState(0);
    const [query, setQuery] = useState("");
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCategory, setSelectedCategory] = useState<CategoryResponse>(
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

    function updateListOfProducts() {
        getNumberOfCategories(query).then((res) => {
            setNumberOfCategories(res);
        });
        getListOfCategories(
            paginationModel.page,
            paginationModel.pageSize,
            query
        ).then((res) => {
            setData(res);
        });
    }
    function handleRowClick(row: CategoryResponse) {
        setIsUpdate(true);
        setSelectedCategory(row);
    }

    useEffect(() => {
        getListOfCategories(
            paginationModel.page,
            paginationModel.pageSize,
            query
        ).then((res) => {
            setData(res);
        });
    }, [paginationModel.pageSize, paginationModel.page]);

    useEffect(() => {
        getNumberOfCategories(query).then((res) => {
            setNumberOfCategories(res);
        });
        getListOfCategories(
            paginationModel.page,
            paginationModel.pageSize,
            query
        )
            .then((res) => {
                setData(res);
            })
            .finally(() => setLoading(false));
    }, [query]);
    return (
        <Box>
            <CategoryPageAppBar />
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
                            Loại sản phẩm
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            sx={{ textTransform: "none" }}
                            onClick={() => setIsAdd(true)}
                        >
                            Thêm loại sản phẩm
                        </Button>
                    </Box>
                    <Box sx={{ backgroundColor: "white", padding: "16px" }}>
                        <SearchField
                            onKeyPress={setQuery}
                            placeHolder="Tìm kiếm loại sản phẩm theo tên"
                        />
                        <TableContainer component={Paper} sx={{ mt: "16px" }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Mã loại</TableCell>
                                        <TableCell>Tên loại sản phẩm</TableCell>
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
                                count={numberOfCategories}
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
                <UpdateCategory
                    selectedCategory={selectedCategory}
                    setIsUpdate={setIsUpdate}
                    onUpdate={updateListOfProducts}
                />
            ) : (
                <></>
            )}
            {isAdd ? (
                <AddCategory
                    setIsAdd={setIsAdd}
                    onUpdate={updateListOfProducts}
                />
            ) : (
                <></>
            )}
        </Box>
    );
}
