import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from "@mui/material"

import MainBox from "../../components/layout/MainBox"

import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";


import MainAppBar from "../../components/layout/MainAppBar.tsx";
import {deleteCustomer, getCustomerDetailById, updateCustomer} from "../../services/customerAPI.ts";

import {formatDate} from "../../utils/formatDate.ts";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import {toast} from "react-toastify";
import {formatCurrency} from "../../utils/formatCurrency.ts";
import CustomerDetail from "../../models/CustomerDetail.ts";
import NewCustomer from "../../models/NewCustomer.ts";


interface OrderDtoV2 {
  id: number;
  code: string;
  customerName: string;
  createdOn: string; // hoặc Date nếu bạn parse
  totalQuantity: number;
  totalPayment: number;
}

// Thông tin phân trang
interface OrderPageInfo {
  totalElements: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
export default function CustomerDetailPage() {
  const navigate = useNavigate();
  const { customerId } = useParams<{ customerId: string }>();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [customer1, setCustomer1] = useState();

  const [newCustomer, setNewCustomer] = useState<any>(null);

  const [pageNum, setPageNum] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false); // Modal xác nhận xóa
  // Khai báo ref cho giá trị tạm thời
  const tempCustomerRef = useRef<CustomerDetail | null >(null);
  const [phoneError, setPhoneError] = useState<boolean>(false); // Trạng thái để lưu lỗi số điện thoại


  const [orders, setOrders] = useState<OrderDtoV2[]>([]);
  const [orderPageInfo, setOrderPageInfo] = useState<OrderPageInfo>({
    totalElements: 0,
    pageNumber: 0,
    pageSize: 5,
    totalPages: 0
  });
  const fetchCustomerOrders = async () => {
    try {
      const response = await fetch(`https://store-manager-ixub.onrender.com/v1/customers/${customerId}/orders?page=${pageNum}&size=${pageSize}`);

      if (!response.ok) {
        throw new Error(`Lỗi ${response.status}`);
      }

      const data = await response.json();

      setOrders(data.content); // danh sách đơn hàng
      setOrderPageInfo({
        totalElements: data.totalElements,
        pageNumber: data.number, // số trang hiện tại (bắt đầu từ 0)
        pageSize: data.size,
        totalPages: data.totalPages
      });
      setPageNum(data.number);
      setPageSize(data.size);

    } catch (error: any) {
      toast.error("Không thể lấy danh sách đơn hàng: " + error.message);
    }
  };

  const fetchCustomerById = async () => {
    try{
      const customerById = await getCustomerDetailById(customerId);
      setCustomer(customerById);

      const newCustomerData = NewCustomer.fromCustomer(customerById);
      setNewCustomer(newCustomerData);

      tempCustomerRef.current = customerById;

    }catch (error: any) {
      setCustomer(null);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (customerId) {
      fetchCustomerById();

    }
  }, [customerId,customer1]);

  useEffect(() => {
    if (customerId) {
      fetchCustomerOrders();
    }
  }, [customerId, pageNum, pageSize]);


  // const handleBackToCustomers = () => {
  //     navigate("/customers"); // Điều hướng về trang danh sách khách hàng
  // };
  // const [value, setValue] = useState('1');
  //
  // const handleChange = (event: React.SyntheticEvent, newValue: string) => {
  //     setValue(newValue);
  // };


  const handleUpdateCustomer = async () => {
    try {
      const updatedCustomer = await updateCustomer(customerId, newCustomer); // Gọi API để cập nhật
      setCustomer1(updatedCustomer);
      setPhoneError(false);
      setOpenModal(false); // Đóng modal
      toast.success('Khách hàng đã được cập nhật thành công!');
    } catch (error: any) {
      if (error.message === 'Số điện thoại đã tồn tại') {
        setPhoneError(true); // Cập nhật trạng thái lỗi số điện thoại
      }else{
        toast.error(error.message);
      }
      // toast.error(error.message);
    }
  };

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPageNum(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10)); // Cập nhật số hàng trên mỗi trang
    setPageNum(0); // Reset về trang đầu khi thay đổi số hàng
  };

  const handleCloseModal = () => {
    setCustomer(tempCustomerRef.current);
    setOpenModal(false);  // Đóng modal


  };
  const handleChangeCustomer = (e:  React.ChangeEvent<HTMLInputElement>) => {
    if (customer) {
      setCustomer({
        ...customer,
        [e.target.name]: e.target.value
      });
    }
    if(newCustomer){
      setNewCustomer({
        ...newCustomer,
        [e.target.name]: e.target.value
      });
    }

  };


  const handleUpdateCustomerClick = () => {

    setOpenModal(true);  // Mở modal
  };



  const handleDeleteCustomer = async (customerId: number) => {
    try {
      const data = await deleteCustomer(customerId);
      setOpenDeleteModal(false); // Đóng modal sau khi xóa
      console.log('Khách hàng đã được xóa:', data);

      toast.success("Xoá thành công.");
      navigate('/customers');

      // Thực hiện cập nhật giao diện hoặc thông báo thành công
    } catch (error) {
      setOpenDeleteModal(false);
      toast.error("Không thể xoá khách hàng này!")
      console.error('Lỗi khi xóa khách hàng:', error);
      // Xử lý lỗi nếu xảy ra
    }

  };

  const handleDetailsClick = (orderId: number) => {
    navigate(`/orders/${orderId}`); // Chuyển hướng tới trang chi tiết của khách hàng
  };

  return (
      <Box>
        <MainAppBar >
          <Box  sx={{ width: '100%' }}  display="flex"  justifyContent="space-between" alignItems="center">


            <Button variant="text" sx={{ color: '#637381' }} onClick={() => navigate(-1)}><KeyboardArrowLeft /> Quay lại danh sách khách hàng</Button>
            <Button
                sx={{
                  borderRadius: '5px',
                  border: '1px solid var(--danger-color, #FF4D4D)', // Màu viền đỏ
                  color: '#FF4D4D', // Màu chữ đỏ khi không hover
                  background: 'none', // Nền trong suốt
                  padding: '8px 16px',
                  '&:hover': {
                    background: '#FF4D4D', // Màu nền đỏ khi hover
                    color: 'white', // Đổi màu chữ thành trắng khi hover
                  }
                }}
                onClick={() => setOpenDeleteModal(true)}
            >
              Xoá khách hàng
            </Button>



          </Box>
        </MainAppBar>
        <MainBox>
          <Box>


            <Box sx={{ padding: '16px 24px 16px 24px' }}>
              <Typography variant="h6" sx={{
                color: '#000',
                fontFamily: 'Segoe UI',
                fontSize: '25px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: 'normal',
              }} >
                {tempCustomerRef.current?.gender ? 'Anh ' : 'Chị '}
                {tempCustomerRef.current?.name}
              </Typography>
            </Box>
            <Box display="flex">
              <Box sx={{ flexBasis: '75%' }}>
                <Box sx={{backgroundColor: 'white', margin: '16px 24px'}}>
                  <Box sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--sub-color, #D9D9D9)'  // Thêm border-bottom
                  }}>
                    <Box sx={{ padding: '16px' }}>
                      <Typography variant="h6" sx={{  fontWeight: 600, fontSize: '20px', color: 'black'  }} >
                        Thông tin cá nhân
                      </Typography>
                    </Box>

                    <Box sx={{ padding: '16px' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '20px', cursor: 'pointer', color: 'var(--primary-color, #08F)'  }} onClick={handleUpdateCustomerClick}>
                        Cập nhật
                      </Typography>
                    </Box>



                  </Box>
                  <Box>
                    <Grid container >
                      {/* Cột đầu tiên */}
                      <Grid item xs={6} display="flex" alignItems="center" sx={{ padding: '16px 10px 12px 16px'  }} >
                        <Typography variant="subtitle1" sx={{ flex: 1.2 }}>Mã khách hàng</Typography>
                        <Typography variant="body1" sx={{ flex: 2 }}>: {tempCustomerRef.current?.code}</Typography> {/* Giá trị trường */}
                      </Grid>

                      <Grid item xs={6} display="flex" alignItems="center" sx={{ padding: '16px 10px 12px 16px' }}>
                        <Typography variant="subtitle1" sx={{ flex: 1.2 }}>Địa chỉ</Typography>
                        <Typography variant="body1" sx={{ flex: 2 }}>: {tempCustomerRef.current?.address ? tempCustomerRef.current?.address : 'N/A'}</Typography> {/* Giá trị trường */}
                      </Grid>

                      <Grid item xs={6} display="flex" alignItems="center" sx={{ padding: '16px 10px 12px 16px'  }}>
                        <Typography variant="subtitle1" sx={{ flex: 1.2 }}>Số điện thoại</Typography>
                        <Typography variant="body1" sx={{ flex: 2 }}>: {tempCustomerRef.current?.phoneNumber}</Typography> {/* Giá trị trường */}
                      </Grid>

                      <Grid item xs={6} display="flex" alignItems="center" sx={{ padding: '16px 10px 12px 16px'  }}>
                        <Typography variant="subtitle1" sx={{ flex: 1.2 }}>Ngày sinh</Typography>
                        <Typography variant="body1" sx={{ flex: 2 }}>: {tempCustomerRef.current?.birthday
                            ? tempCustomerRef.current?.birthday.toLocaleDateString('en-GB')
                            : 'N/A'}
                        </Typography> {/* Giá trị trường */}
                      </Grid>

                      {/* Cột thứ hai */}
                      <Grid item xs={6} display="flex" alignItems="center" sx={{ padding: '16px 10px 12px 16px'  }}>
                        <Typography variant="subtitle1" sx={{ flex: 1.2 }}>Email</Typography>
                        <Typography variant="body1" sx={{ flex: 2 }}>: {tempCustomerRef.current?.email ? tempCustomerRef.current?.email : 'N/A'}</Typography> {/* Giá trị trường */}
                      </Grid>

                      <Grid item xs={6} display="flex" alignItems="center" sx={{ padding: '16px 10px 12px 16px'  }}>
                        <Typography variant="subtitle1" sx={{ flex: 1.2 }}>Ngày tạo</Typography>
                        <Typography variant="body1" sx={{ flex: 2 }}>: {formatDate(tempCustomerRef.current?.createdOn.toISOString())}</Typography> {/* Giá trị trường */}
                      </Grid>

                      <Grid item xs={6} display="flex" alignItems="center" sx={{ padding: '16px 10px 12px 16px'  }}>
                        <Typography variant="subtitle1" sx={{ flex: 1.2 }}>Giới tính</Typography>
                        <Typography variant="body1" sx={{ flex: 2 }}>: {tempCustomerRef.current?.gender ? 'Nam' : 'Nữ'}</Typography> {/* Giá trị trường */}
                      </Grid>

                      <Grid item xs={6} display="flex" alignItems="center" sx={{ padding: '16px 10px 12px 16px'  }}>
                        <Typography variant="subtitle1" sx={{ flex: 1.2 }}>Ngày cập nhật cuối cùng</Typography>
                        <Typography variant="body1" sx={{ flex: 2 }}>: {customer ? formatDate(tempCustomerRef.current?.updatedOn.toISOString()) : 'N/A'}</Typography> {/* Giá trị trường */}
                      </Grid>

                    </Grid>

                  </Box>

                </Box>
                <Box sx={{backgroundColor: 'white', margin: '16px 24px'}}>
                  <Box sx={{
                    width: '100%',
                    borderBottom: '1px solid var(--sub-color, #D9D9D9)'  // Thêm border-bottom
                  }}>
                    <Box sx={{ padding: '16px' }}>
                      <Typography variant="h6" sx={{  fontWeight: 600, fontSize: '20px', color: 'black'  }} >
                        Thông tin mua hàng
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Grid container>
                      <Grid item xs={6} display="flex" alignItems="center" sx={{ padding: '16px' }} >
                        <Typography variant="subtitle1" sx={{ flex: 1 }}>Tổng chi tiêu</Typography>
                        <Typography variant="body1" sx={{ flex: 1 }}>: {formatCurrency(tempCustomerRef.current?.totalExpense ?? 0) }</Typography> {/* Giá trị trường */}
                      </Grid>

                      <Grid item xs={6} display="flex" alignItems="center" sx={{ padding: '16px' }}>
                        <Typography variant="subtitle1" sx={{ flex: 1 }}>Ngày đầu tiên mua hàng</Typography>
                        <Typography variant="body1" sx={{ flex: 1 }}>
                          : {tempCustomerRef.current?.earliestOrderDate
                            ? formatDate(tempCustomerRef.current?.earliestOrderDate.toISOString())
                            : 'N/A'} </Typography> {/* Giá trị trường */}
                      </Grid>

                      <Grid item xs={6} display="flex" alignItems="center" sx={{ padding: '16px' }}>
                        <Typography variant="subtitle1" sx={{ flex: 1 }}>Tổng SL đơn hàng</Typography>
                        <Typography variant="body1" sx={{ flex: 1 }}>: {tempCustomerRef.current?.numberOfOrder}</Typography> {/* Giá trị trường */}
                      </Grid>

                      <Grid item xs={6} display="flex" alignItems="center" sx={{ padding: '16px' }}>
                        <Typography variant="subtitle1" sx={{ flex: 1 }}>Ngày mua hàng gần nhất</Typography>
                        <Typography variant="body1" sx={{ flex: 1 }}>
                          : {tempCustomerRef.current?.earliestOrderDate
                            ? formatDate(tempCustomerRef.current?.earliestOrderDate.toISOString())
                            : 'N/A'}</Typography> {/* Giá trị trường */}
                      </Grid>
                    </Grid>

                  </Box>

                </Box>
              </Box>
              <Box sx={{ flexBasis: '25%', display: 'inline-block',backgroundColor: 'white', margin: '16px 24px 16px 0px' }}>
                <Box sx={{
                  width: '100%',
                  borderBottom: '1px solid var(--sub-color, #D9D9D9)'  // Thêm border-bottom
                }}>
                  <Box sx={{ padding: '16px' }}>
                    <Typography variant="h6" sx={{  fontWeight: 600, fontSize: '20px',  color: 'black'  }} >
                      Ghi chú
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{padding: '16px'}}>
                  {/*{customer?.note ?*/}
                  {/*    <Typography variant="body1" sx={{ flex: 1 }}>{customer?.note}</Typography>*/}
                  {/*    : <Typography variant="body1" sx={{ flex: 1 }}>Không có thông tin ghi chú</Typography>}*/}

                  <textarea
                      rows={4}
                      name="note"
                      style={{ width: '100%', padding: '5px',fontFamily: 'Segoe UI' }}
                      placeholder="Nhập ghi chú ở đây..."
                      value={customer?.note} // Hiển thị ghi chú từ customer.note
                      onChange={(e) => {
                        // Xử lý khi người dùng thay đổi ghi chú
                        if (customer) {
                          setCustomer({
                            ...customer,
                            [e.target.name]: e.target.value
                          });
                          setNewCustomer({
                            ...newCustomer,
                            [e.target.name]: e.target.value
                          });
                        }
                      }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdateCustomer()}
                    >
                      Lưu
                    </Button>
                  </Box>
                </Box>

              </Box>

            </Box>
            <Box sx={{ backgroundColor: 'white', margin: '16px 24px' }}>
              <Box sx={{ width: '100%', typography: 'body1' }}>

                <Box sx={{
                  width: '100%',
                  borderBottom: '1px solid var(--sub-color, #D9D9D9)'  // Thêm border-bottom
                }}>
                  <Box sx={{ padding: '16px' }}>
                    <Typography variant="h6" sx={{  fontWeight: 600, fontSize: '20px', color: 'black'  }} >
                      Lịch sử đơn hàng
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ }}>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Mã đơn hàng</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Ngày tạo đơn</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Số lượng sản phẩm</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Số tiền thanh toán</TableCell>
                        {/*<TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Nhân viên xử lý đơn</TableCell>*/}

                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(orders) && orders.length > 0 ? (
                          orders.map((order) => (
                              <TableRow
                                  key={order.code}
                                  sx={{
                                    '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                                    '&:hover': { backgroundColor: '#e0f7fa' }, // Hover effect
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => handleDetailsClick(order.id)}

                              >
                                <TableCell>{order.code}</TableCell>
                                <TableCell>{formatDate(order.createdOn.toString())}</TableCell>
                                <TableCell>{order.totalQuantity}</TableCell>
                                <TableCell>{formatCurrency(order.totalPayment)}</TableCell>

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
                      count={orderPageInfo.totalElements || 0} // Tổng số lượng đơn hàng
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
                {/*</TabPanel>*/}



              </Box>

            </Box>

            {/*Cập nhật customer*/}
            <Dialog sx={{padding: '10px'}} open={openModal} onClose={handleCloseModal}>
              <DialogTitle sx={{fontWeight: '700'}}>Cập nhật thông tin khách hàng </DialogTitle>
              <Divider/>
              <DialogContent>
                <Grid container spacing={2}>
                  {/* Tên khách hàng */}
                  <Grid item xs={6}>
                    <TextField

                        margin="dense"
                        label="Tên khách hàng"
                        name="name"
                        fullWidth
                        value={customer?.name}
                        onChange={handleChangeCustomer}
                    />
                  </Grid>

                  {/* Số điện thoại */}
                  <Grid item xs={6}>
                    <TextField
                        margin="dense"
                        label="Số điện thoại"
                        name="phoneNumber"
                        fullWidth
                        value={customer?.phoneNumber}
                        error={phoneError}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChangeCustomer(e);
                          setPhoneError(false); // Reset lỗi khi người dùng thay đổi giá trị
                        }}
                        helperText={phoneError ? "Số điện thoại đã tồn tại" : ""}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: phoneError ? 'red' : 'default', // Thay đổi màu viền thành đỏ khi có lỗi
                            },
                          },
                        }}
                    />
                  </Grid>

                  {/* Ngày sinh */}
                  <Grid item xs={6}>
                    <TextField
                        margin="dense"
                        label="Ngày sinh"
                        name="birthday"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={customer?.birthday ? new Date(customer.birthday).toISOString().split('T')[0] : ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {if (customer) {
                          setCustomer({
                            ...customer,
                            [e.target.name]: new Date(e.target.value) // Chuyển đổi giá trị ngày thành Date
                          });
                        }
                          if(newCustomer){
                            setNewCustomer({
                              ...newCustomer,
                              [e.target.name]: new Date(e.target.value) // Chuyển đổi giá trị ngày thành Date
                            });
                          }
                        }}/>
                  </Grid>

                  {/* Email */}
                  <Grid item xs={6}>
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        value={customer?.email}
                        onChange={handleChangeCustomer}
                    />
                  </Grid>

                  {/* Địa chỉ */}
                  <Grid item xs={12}>
                    <TextField
                        margin="dense"
                        label="Địa chỉ"
                        name="address"
                        fullWidth
                        value={customer?.address}
                        onChange={handleChangeCustomer}
                    />
                  </Grid>

                  {/* Giới tính */}
                  <Grid item xs={12}>
                    <FormControl component="fieldset" margin="dense">
                      <FormLabel component="legend">Giới tính</FormLabel>
                      <RadioGroup
                          row
                          aria-label="gender"
                          name="gender"
                          value={customer?.gender ? "male" : "female"}  // Hiển thị đúng giới tính theo boolean
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if(customer){
                              setCustomer({...customer, gender: e.target.value === "male" });

                            }if(newCustomer){
                              setNewCustomer({...newCustomer, gender: e.target.value === "male" });
                            }
                          }}
                      >
                        <FormControlLabel value="male" control={<Radio />} label="Nam" />
                        <FormControlLabel value="female" control={<Radio />} label="Nữ" />

                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>

              </DialogContent>
              <Divider/>
              <DialogActions>
                <Button
                    onClick={handleCloseModal}
                    color="secondary"
                    sx={{
                      borderRadius: '5px',
                      border: '1px solid var(--primary-color, #08F)',
                      color: '#08F',
                      background: 'none', // Hoặc bỏ thuộc tính này nếu muốn màu nền mặc định
                      padding: '8px 16px', // Có thể thêm padding để nút đẹp hơn
                      '&:hover': {
                        background: 'var(--primary-color, #08F)', // Đổi màu nền khi hover
                        color: 'white', // Đổi màu chữ khi hover
                      }
                    }}
                >
                  Thoát
                </Button>
                <Button
                    onClick={() => {

                      handleUpdateCustomer(); // Gọi hàm cập nhật

                      // setOpenModal(false);
                    }}
                    sx={{
                      borderRadius: '5px',
                      border: '1px solid var(--primary-color, #08F)',
                      background: 'var(--primary-color, #08F)', // Màu nền cho nút Lưu
                      color: 'white', // Màu chữ cho nút Lưu
                      padding: '8px 16px', // Có thể thêm padding
                      '&:hover': {
                        background: 'darken(var(--primary-color, #08F), 10%)', // Tối màu nền khi hover
                      }
                    }}
                >
                  Lưu
                </Button>
              </DialogActions>


            </Dialog>

            {/*xoá customer*/}
            <Dialog
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                  '& .MuiDialog-paper': {
                    position: 'absolute',
                    top: '10%', // Đặt modal nằm gần phía trên
                    left: '50%',
                    transform: 'translate(-50%, 0)', // Giữ modal ở giữa theo chiều ngang
                    // Giới hạn độ rộng modal nếu cần
                    width: '100%', // Đảm bảo modal không vượt quá kích thước
                  },
                }}
            >
              <DialogTitle id="alert-dialog-title" sx={{
                fontWeight: '600',
                color: '#000', // Màu chữ đen
                fontFamily: 'Segoe UI', // Font chữ
                fontSize: '26px', // Kích thước chữ
                fontStyle: 'normal', // Kiểu chữ (không nghiêng)
                lineHeight: 'normal', // Khoảng cách dòng bình thường
              }}>
                Xoá khách hàng
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description" style={{
                  color: '#000', // Màu chữ đen
                  fontFamily: 'Segoe UI', // Font Segoe UI
                  fontSize: '16px', // Kích thước chữ 16px
                  fontStyle: 'normal', // Kiểu chữ bình thường
                  fontWeight: 400, // Độ đậm chữ
                  lineHeight: 'normal', // Độ cao dòng bình thường
                }}>
                  Bạn có chắc chắn muốn xóa khách hàng
                  <span
                      style={{
                        color: '#000', // Màu chữ đen
                        fontFamily: 'Segoe UI', // Font Segoe UI
                        fontSize: '16px', // Kích thước chữ 16px
                        fontStyle: 'normal', // Kiểu chữ bình thường
                        fontWeight: 700, // Độ đậm chữ
                        lineHeight: 'normal', // Độ cao dòng bình thường
                      }}
                  >
                                    {customer?.gender ? ' Anh ' : ' Chị '} {customer?.name}
                                </span> ? Thao tác này không thể khôi phục.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDeleteModal(false)}
                        color="secondary"
                        sx={{
                          borderRadius: '5px', // Bo góc 5px
                          border: '1px solid var(--danger-color, #FF4D4D)', // Viền màu đỏ (hoặc biến màu nguy hiểm)
                          color: '#FF4D4D', // Màu chữ đỏ
                          padding: '8px 16px', // Thêm khoảng cách bên trong nút
                          background: 'none', // Nền trong suốt
                          '&:hover': {
                            backgroundColor: '#f0f0f0', // Màu nền xám nhạt khi hover
                            color: '#FF4D4D', // Giữ màu chữ đỏ
                          },
                        }}>
                  Thoát
                </Button>
                <Button
                    onClick={() => {

                      if (customer) {
                        handleDeleteCustomer(customer.id);
                      }
                      // Hàm xử lý xóa khách hàng

                    }}
                    color="error"
                    autoFocus
                    sx={{
                      borderRadius: '5px', // Bo góc 5px
                      background: 'var(--danger-color, #FF4D4D)', // Nền đỏ từ biến hoặc màu cụ thể
                      color: 'white', // Màu chữ trắng
                      padding: '8px 16px', // Thêm khoảng cách bên trong nút
                      '&:hover': {
                        backgroundColor: 'darkred', // Màu nền khi hover (có thể điều chỉnh)
                      },
                    }}
                >
                  Xoá
                </Button>
              </DialogActions>
            </Dialog>

          </Box>


        </MainBox>
      </Box>
  )
}