import { Box, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from "@mui/material"
import MainBox from "../../components/layout/MainBox"
import React, { useEffect, useState } from "react";
import { getTodayOrders } from "../../services/orderAPI.ts";
import { formatCurrency } from "../../utils/formatCurrency.ts";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formatDate.ts";
import profitUp from '../../assets/profit-up.jpg';
import shoppingBag from '../../assets/shopping-bag.jpg';
import Header from "../../components/layout/Header.tsx";
import  "../styles.css"
import {useSelector} from "react-redux";
import OrderChart from "./OrderChart.tsx";

export default function OverviewPage() {
  const [pageNum, setPageNum] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [orders, setOrders] = useState([]);

  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const navigate = useNavigate();
  const store = useSelector((state: any) => state.storeSetting.store);
  const fetchTodayOrders = async () => {
    setOrders([]);
    setTotalOrders(0);
    setTotalRevenue(0);
    try {
      const data = await getTodayOrders(store.id, pageNum, pageSize); // Gọi API
      setOrders(data.orders.content);
      // setTotalPages(data.orders.totalPages);
      setTotalOrders(data.orders.totalElements);
      setTotalRevenue(data.totalRevenue);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };


  useEffect(() => {
    if(store && store?.id) {
      fetchTodayOrders();
    }
  }, [pageNum, pageSize,store]);
  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPageNum(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10)); // Cập nhật số hàng trên mỗi trang
    setPageNum(0); // Reset về trang đầu khi thay đổi số hàng
  };
  const handleDetailsClick = (orderId: number) => {
    navigate(`/orders/${orderId}`); // Chuyển hướng tới trang chi tiết của khách hàng
  };
  return (
    <Box>
      <Header/>
      <MainBox>
        <Box>
          <Box className="titleHeader">Tổng quan</Box>
          <Box sx={{ display: 'flex', padding: '24px 30px' }}>
            <Box sx={{
              display: 'flex', flexBasis: '40%', marginRight: '20px', backgroundColor: 'white', borderRadius: '5px',  // Bo góc
              background: '#FFF',   // Màu nền trắng
              boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
            }}>
              <Box sx={{ flexBasis: '30%' }}>
                <Box sx={{ padding: '30px' }}>
                  <img src={profitUp} alt="Description" style={{ width: '100%' }} />
                </Box>

              </Box>
              <Box sx={{ flexBasis: '70%', display: 'flex', flexDirection: 'column', padding: '30px' }}>
                <Typography variant="h5" component="div" sx={{
                  height: '50%', color: '#000', // Màu chữ
                  fontFamily: '"Segoe UI", sans-serif', // Phông chữ
                  fontSize: '26px', // Kích thước chữ
                  fontStyle: 'normal', // Kiểu chữ
                  fontWeight: 600, // Độ đậm của chữ
                  lineHeight: 'normal'
                }} // Chiều cao dòng
                >
                  Doanh thu hôm nay
                </Typography>
                <Typography variant="h6" component="div" sx={{ height: '50%' }}>
                  {formatCurrency(totalRevenue)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{
              display: 'flex', flexBasis: '40%', backgroundColor: 'white', borderRadius: '5px',  // Bo góc
              background: '#FFF',   // Màu nền trắng
              boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
            }}>
              <Box sx={{ flexBasis: '30%' }}>
                <Box sx={{ padding: '30px' }}>
                  <img src={shoppingBag} alt="Description" style={{ width: '100%' }} />
                </Box>

              </Box>
              <Box sx={{ flexBasis: '70%', display: 'flex', flexDirection: 'column', padding: '30px' }}>
                <Typography variant="h5" component="div" sx={{
                  height: '50%', color: '#000', // Màu chữ
                  fontFamily: '"Segoe UI", sans-serif', // Phông chữ
                  fontSize: '26px', // Kích thước chữ
                  fontStyle: 'normal', // Kiểu chữ
                  fontWeight: 600, // Độ đậm của chữ
                  lineHeight: 'normal',
                  justifyContent: 'space-between'
                }} // Chiều cao dòng
                >
                  Đơn hàng hôm nay
                </Typography>
                <Typography variant="h6" component="div" sx={{ height: '50%' }}>
                  {totalOrders}
                </Typography>
              </Box>
            </Box>

          </Box>
          <Box sx={{ padding: '20px 30px' }}>
            <Box >
              <Typography variant="h6" sx={{
                color: '#000', // Màu chữ
                fontFamily: '"Segoe UI", sans-serif', // Phông chữ
                fontSize: '26px', // Kích thước chữ
                fontStyle: 'normal', // Kiểu chữ
                fontWeight: 500, // Độ đậm của chữ
                lineHeight: 'normal', // Chiều cao dòng
                paddingBottom: '30px'
              }}  >Đơn hàng mới</Typography>

            </Box>
            <Box>
              <Table sx={{ minWidth: 650, border: '1px solid #ccc', background: '#FFFFFF' }}>
                <TableHead>
                  <TableRow sx={{}}>
                    <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Mã đơn hàng</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Ngày tạo đơn</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Số lượng sản phẩm</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Số tiền thanh toán</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Phương thức thanh toán</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {totalOrders > 0 ? (
                    orders.map((order: any) => (
                      <TableRow
                        key={order.id}
                        sx={{// Hover effect
                          cursor: 'pointer'
                        }}
                        hover
                        onClick={() => handleDetailsClick(order.id)}
                      >
                        <TableCell sx={{ color: '#08F' }}>{order.code}</TableCell>
                        <TableCell>{formatDate(order.createdOn)}</TableCell>
                        <TableCell sx={{ paddingLeft: '5%' }}>{order.totalQuantity}</TableCell>
                        <TableCell>{formatCurrency(order.totalPayment)}</TableCell>
                        <TableCell>{order.paymentType === "CASH" ? "Tiền mặt" : "Quét mã QR"}</TableCell>

                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5}>Không có đơn hàng nào</TableCell>
                    </TableRow>
                  )}
                </TableBody>

              </Table>

              <TablePagination
                component="div"
                count={totalOrders} // Tổng số lượng đơn hàng
                page={pageNum}
                onPageChange={handleChangePage}
                rowsPerPage={pageSize}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10]} // Các tùy chọn số hàng
                labelRowsPerPage="Số hàng trên mỗi trang"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong tổng số ${count}`}
                sx={{ mt: 2 }} // Margin top
              />
            </Box>
          </Box>
          <OrderChart/>
        </Box>
      </MainBox>
    </Box>
  )
}