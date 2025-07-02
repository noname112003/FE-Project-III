import React from 'react';
import { Box, Typography, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';

type ReceiptProps = {
  order: any;
}

export const ReceiptToPrint = React.forwardRef<HTMLDivElement, ReceiptProps>((_props, ref) => {

  const { order } = _props;

  return (
    <div ref={ref} style={{ padding: '10px' }}>
      <Typography variant="h6" sx={{ textAlign: 'center' }}>HÓA ĐƠN BÁN HÀNG</Typography>
      <Box mt={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1">Ngày bán: {formatDate(order.createdOn)}</Typography>
          <Typography variant="body1">Mã hóa đơn: {order.code}</Typography>
        </Box>
        <Typography variant="body1">Nhân viên bán hàng: {order.creatorId}</Typography>
      </Box>
      <Box mt={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Đơn giá</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Thành tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.orderDetails.map((orderDetail: any, _index: number) => (
                <TableRow key={orderDetail.variant.id}>
                  <TableCell>{orderDetail.variant.name}</TableCell>
                  <TableCell>{orderDetail.variant.priceForSale}</TableCell>
                  <TableCell>{orderDetail.quantity}</TableCell>
                  <TableCell>{orderDetail.subTotal}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ mt: 2 }}>Ghi chú</Typography>
        <Typography variant="body1">{order.note.length === 0 ? "Không có" : order.note}</Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">Hình thức thanh toán</Typography>
          <Typography variant="body1">{order.paymentType === "CASH" ? "Tiền mặt" : "Quét mã QR"}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">Tổng tiền</Typography>
          <Typography variant="body1">{formatCurrency(order.totalPayment)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">Tiền khách trả</Typography>
          <Typography variant="body1">{formatCurrency(order.cashReceive)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">Tiền thừa</Typography>
          <Typography variant="body1">{formatCurrency(order.cashRepay)}</Typography>
        </Box>
      </Box>
    </div>
  )
})