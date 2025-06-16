import { Box, Paper, TableContainer, Typography, Table, TableHead, TableRow, TableCell, TableBody, Skeleton } from '@mui/material'
import MainBox from '../../../components/layout/MainBox'
import DetailOrderAppBar from './DetailOrderAppBar'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOrderDetail } from '../../../services/orderAPI';
import { getCustomerById } from '../../../services/customerAPI';
import Customer from '../../../models/Customer';
import { formatCurrency } from '../../../utils/formatCurrency';
import Order from '../../../models/Order';
import { formatDate } from '../../../utils/formatDate';

type Props = {}

export default function DetailOrderPage({ }: Props) {

  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order>();
  const [customer, setCustomer] = useState<Customer>();

  useEffect(() => {
    getOrderDetail(id).then((res) => {
      setOrder(Order.fromJson(res.data));
      getCustomerById(res.data.customerId).then((res) => {
        if (res) {
          setCustomer(res);
        }
      })
    })
  }, [id])

  return (
    <MainBox>
      <DetailOrderAppBar order={order}/>
      <Box sx={{ backgroundColor: '#F0F1F1', padding: '25px 30px' }} flex={1} display='flex' flexDirection='column'>
        <Box display="flex">
          <Box flex={2} bgcolor="#fff" p={2} mb={2} marginRight="20px">
            <Typography variant="h6" sx={{ color: '#000', fontWeight: '600' }} mb={2}>Thông tin khách hàng</Typography>
            {customer ? <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="body1" sx={{ color: '#000', fontWeight: '600' }} mb={1}>{customer.name}</Typography>
                <Typography variant="body1" sx={{ color: '#000' }} mb={1}>{customer.phoneNumber}</Typography>
                <Typography variant="body1" sx={{ color: '#000' }}>{customer.address}</Typography>
              </Box>
              <Box border="1px dashed" p={1}>
                <Typography variant="body1" sx={{ color: '#000' }} mb={1}>Số đơn hàng: {customer.numberOfOrder}</Typography>
                <Typography variant="body1" sx={{ color: '#000' }} mb={1}>Tổng chi tiêu: {formatCurrency(customer.totalExpense)}</Typography>
              </Box>
            </Box> :
            <Box>
              <Skeleton variant="rectangular" />
            </Box>
            }
          </Box>
          <Box flex={1} bgcolor="#fff" p={2} mb={2}>
            <Typography variant="h6" sx={{ color: '#000', fontWeight: '600' }} mb={2}>Thông tin đơn hàng</Typography>
            {order ? <Box>
              <Typography variant="body1" sx={{ color: '#000' }} mb={1}>Mã đơn hàng: {order.code}</Typography>
              <Typography variant="body1" sx={{ color: '#000' }} mb={1}>Ngày tạo: {formatDate(order.createdOn.toISOString())}</Typography>
              <Typography variant="body1" sx={{ color: '#000' }} mb={1}>Ngày cập nhật: {formatDate(order.updatedTime.toISOString())}</Typography>
            </Box> :
            <Box>
              <Skeleton variant="text" />
              <Skeleton variant="text" />
            </Box>
            }
          </Box>
        </Box>
        <Box bgcolor="#fff" p={2} mb={2}>
          <Typography variant="h6" sx={{ color: '#000', fontWeight: '600' }} mb={2}>Thông tin sản phẩm</Typography>
          {order ? <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Ảnh</TableCell>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Thành tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  order.orderDetails.map((orderDetail: any, index: number) => (
                    <TableRow key={orderDetail.productId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{orderDetail.variant.imagePath && <img src={orderDetail.variant.imagePath} alt={orderDetail.variant.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />}</TableCell>
                      <TableCell>{orderDetail.variant.name}</TableCell>
                      <TableCell>{formatCurrency(orderDetail.variant.priceForSale)}</TableCell>
                      <TableCell>{orderDetail.quantity}</TableCell>
                      <TableCell>{formatCurrency(orderDetail.subTotal)}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer> : 
          <Box>
            <Skeleton variant="rectangular" height={200} />
          </Box>
          }
          <Box>
            <Typography variant="body1" sx={{ color: '#000', fontWeight: '600' }} mt={2} mb={2}>Ghi chú đơn hàng</Typography>
            {order ? <Typography variant="body1" sx={{ color: '#000' }}>{order.note.length === 0 ? "Không có" : order.note}</Typography> :
            <Box>
              <Skeleton variant="text" />
            </Box>
            }
          </Box>
        </Box>
        <Box bgcolor="#fff" p={2} mb={2}>
          <Typography variant="h6" sx={{ color: '#000', fontWeight: '600' }} mb={2}>Thông tin thanh toán</Typography>
          {order ? <Box>
            <Typography variant="body1" sx={{ color: '#000' }} mb={2}>Tổng tiền: {formatCurrency(order.totalPayment)}</Typography>
            <Typography variant="body1" sx={{ color: '#000' }}>Phương thức thanh toán: {order.paymentType === "CASH" ? "COD" : null}</Typography>
          </Box> : 
          <Box>
            <Skeleton variant="text" />
          </Box>
          }
        </Box>
      </Box>
    </MainBox>
  )
}