import { useEffect, useState } from "react"
import MainBox from "../../../components/layout/MainBox"
import OrderListAppBar from "./OrderListAppBar"
import { Box, Button, Paper, TableBody, TableContainer, Table, TableHead, TableRow, TableCell, TableFooter, TablePagination, Typography, InputBase } from '@mui/material'
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

type TablePaginationActionsProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

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

type Props = {}

export default function OrderListPage({ }: Props) {

  const [orderData, setOrderData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(100);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(10, 'day'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  }

  const handleSearch = () => {
    setIsLoading(true);
    getAllOrders(page, pageSize, search, startDate?.format('DD/MM/YYYY') || '', endDate?.format('DD/MM/YYYY') || '').then((res) => {
      setOrderData(res.data);
    })
    getNumberOfOrders(search, startDate?.format('DD/MM/YYYY') || '', endDate?.format('DD/MM/YYYY') || '').then((res) => {
      setTotalPage(res.data);
      setIsLoading(false);
    })
  }

  useEffect(() => {
    setIsLoading(true);
    const startDateStr = startDate?.format('DD/MM/YYYY') || dayjs().format('DD/MM/YYYY');
    const endDateStr = endDate?.format('DD/MM/YYYY') || dayjs().format('DD/MM/YYYY');
    getAllOrders(page, pageSize, '', startDateStr, endDateStr).then((res) => {
      setOrderData(res.data);
      setIsLoading(false);
    })
  }, [page, pageSize])

  useEffect(() => {
    setIsLoading(true);
    const startDateStr = startDate?.format('DD/MM/YYYY') || dayjs().subtract(10, 'day').format('DD/MM/YYYY');
    const endDateStr = endDate?.format('DD/MM/YYYY') || dayjs().format('DD/MM/YYYY');
    getNumberOfOrders('', startDateStr, endDateStr).then((res) => {
      setTotalPage(res.data);
      setIsLoading(false);
    })
  }, [])

  return (
    <MainBox>
      <OrderListAppBar />
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
  )
}