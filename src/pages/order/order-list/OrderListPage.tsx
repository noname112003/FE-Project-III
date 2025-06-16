import React, { useEffect, useState } from "react"
import MainBox from "../../../components/layout/MainBox"
import {
  Box,
  Button,
  Paper,
  TableBody,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
  Typography,
  InputBase,
} from '@mui/material'
import { getAllOrders, getNumberOfOrders } from "../../../services/orderAPI"
import { formatDate } from "../../../utils/formatDate"
import { formatCurrency } from "../../../utils/formatCurrency"
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs, { Dayjs } from "dayjs"
import Search from '@mui/icons-material/Search'
import Header from "../../../components/layout/Header.tsx"
import {useSelector} from "react-redux";
type TablePaginationActionsProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import '../styles.css';

function TablePaginationActions({ count, page, rowsPerPage, onPageChange }: TablePaginationActionsProps) {
  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  }

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <Button onClick={handleBackButtonClick} disabled={page === 0} size="small">
        <KeyboardArrowLeft />
      </Button>
      <Button onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} size="small">
        <KeyboardArrowRight />
      </Button>
    </Box>
  )
}


export default function OrderListPage() {

  const [orderData, setOrderData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(100);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(10, 'day'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const store = useSelector((state: any) => state.storeSetting.store);

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  }

  const handleSearch = () => {
    setIsLoading(true);
    getAllOrders(page, pageSize, search, startDate?.format('DD/MM/YYYY') || '', endDate?.format('DD/MM/YYYY') || '', store.id).then((res) => {
      setOrderData(res.data);
    })
    getNumberOfOrders(search, startDate?.format('DD/MM/YYYY') || '', endDate?.format('DD/MM/YYYY') || '', store.id).then((res) => {
      setTotalPage(res.data);
      setIsLoading(false);
    })
  }

  useEffect(() => {
    setIsLoading(true);
    const startDateStr = startDate?.format('DD/MM/YYYY') || dayjs().format('DD/MM/YYYY');
    const endDateStr = endDate?.format('DD/MM/YYYY') || dayjs().format('DD/MM/YYYY');
    store && getAllOrders(page, pageSize, '', startDateStr, endDateStr, store.id).then((res) => {
      setOrderData(res.data);
      setIsLoading(false);
    })
  }, [page, pageSize, store])

  useEffect(() => {
    setIsLoading(true);
    const startDateStr = startDate?.format('DD/MM/YYYY') || dayjs().subtract(10, 'day').format('DD/MM/YYYY');
    const endDateStr = endDate?.format('DD/MM/YYYY') || dayjs().format('DD/MM/YYYY');
    store && getNumberOfOrders('', startDateStr, endDateStr, store.id).then((res) => {
      setTotalPage(res.data);
      setIsLoading(false);
    })
  }, [store])

  return (
      <Box>
        <Header/>
        <MainBox>
          <Box className="titleHeader">Danh sách đơn hàng</Box>
          <Box sx={{ backgroundColor: '#F0F1F1', padding: '25px 30px' }} flex={1} display='flex' flexDirection='column'>
            <Button sx={{ alignSelf: 'end', mb: 2 }} variant="contained" onClick={() => navigate('create')}>Tạo đơn hàng</Button>
            <Box bgcolor="#fff" p={2}>
              <Box display="flex" mb={2} alignItems="center">
                <Box flex={1}>
                  <Box
                      sx={{
                        border: "1px solid #d9d9d9",
                        alignItems: "center",
                        display: "flex",
                        borderRadius: "5px",
                        padding: "10px 15px",
                        gap: "30px",
                        marginRight: '20px'
                      }}
                  >
                    <Search
                        sx={{
                          color: "#d9d9d9",
                          height: "32px",
                          width: "32px",
                        }}
                    />
                    <InputBase
                        value={search}
                        sx={{ width: "100%" }}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm kiếm đơn hàng"
                    />
                  </Box>
                </Box>
                <Typography sx={{ marginRight: '20px' }}>Từ ngày</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                      value={startDate}
                      onChange={(newValue) => {
                        if (newValue && endDate && newValue.isAfter(endDate)) {
                          setEndDate(newValue)
                        }
                        setStartDate(newValue)
                      }}
                      format="DD/MM/YYYY"
                  />
                </LocalizationProvider>
                <Typography sx={{ marginRight: '20px', marginLeft: '20px' }}>Đến ngày</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                      value={endDate}
                      onChange={(newValue) => {
                        if (newValue && startDate && newValue.isBefore(startDate)) {
                          setStartDate(newValue)
                        }
                        setEndDate(newValue)
                      }}
                      format="DD/MM/YYYY"
                  />
                </LocalizationProvider>
                <Button sx={{ marginLeft: '20px' }} onClick={handleSearch} variant="contained">Tìm kiếm</Button>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã đơn hàng</TableCell>
                      <TableCell>Thời gian tạo</TableCell>
                      <TableCell>Khách hàng</TableCell>
                      <TableCell>Số sản phẩm</TableCell>
                      <TableCell>Số tiền thanh toán</TableCell>
                      <TableCell>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      !isLoading ? orderData && orderData.map((order: any) => (
                          <TableRow sx={{ cursor: 'pointer' }} key={order.code} hover onClick={() => navigate(`${order.id}`)}>
                            <TableCell sx={{ color: '#08F' }}>{order.code}</TableCell>
                            <TableCell>{formatDate(order.createdOn)}</TableCell>
                            <TableCell>{order.customerName}</TableCell>
                            <TableCell>{order.totalQuantity}</TableCell>
                            <TableCell>{formatCurrency(order.totalPayment)}</TableCell>
                            <TableCell>
                              <EditIcon
                                  sx={{ cursor: 'pointer', mr: 2, color: '#e6e8ea' }}
                                  className="icon_edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`${order.id}/update`); // hoặc đường dẫn cập nhật bạn muốn
                                  }}
                              />
                              <DeleteIcon
                                  sx={{ cursor: 'pointer', color: '#e6e8ea' }}
                                  className="icon_remove"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Gọi hàm xoá đơn hàng
                                    // handleDeleteOrder(order.id);
                                  }}
                              />
                            </TableCell>
                          </TableRow>
                      )) :
                          <TableRow>
                            <TableCell colSpan={5} align="center">Đang tải dữ liệu...</TableCell>
                          </TableRow>
                    }
                  </TableBody>
                  <TableFooter>
                    <TablePagination
                        rowsPerPageOptions={[1, 10, 25]}
                        count={totalPage}
                        rowsPerPage={pageSize}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                        labelRowsPerPage="Số hàng trên mỗi trang"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong tổng số ${count}`}
                    />
                  </TableFooter>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </MainBox>
      </Box>

  )
}

export const IconEdit = () => (
    <svg
        width="13"
        height="14"
        viewBox="0 0 13 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
      <path
          d="M7.90015 3.09985L0.176821 10.8232L0.153328 12.806C0.147905 13.2637 0.564731 13.6805 1.02247 13.6751L3.00525 13.6516L10.7286 5.92827L7.90015 3.09985Z"
          fill="#747C87"
      />
      <path
          d="M11.2113 5.44557L12.6594 3.99743C12.926 3.73083 12.8889 3.26145 12.5765 2.94903L10.8794 1.25198C10.567 0.939558 10.0976 0.902408 9.831 1.169L8.38286 2.61714L11.2113 5.44557Z"
          fill="#747C87"
      />
    </svg>
);