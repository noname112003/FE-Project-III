import {
  Box,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, Grid,
  InputAdornment, Radio, RadioGroup, Table,
  TableBody,
  TableCell,
  TableHead, TablePagination,
  TableRow,
  TextField, Tooltip,
  Typography
} from "@mui/material"
import CustomerPageAppBar from "./CustomerPageAppBar.tsx"
import MainBox from "../../components/layout/MainBox"
import SearchIcon from '@mui/icons-material/Search';
import React, { ChangeEvent, useEffect, useState } from "react";
import Customer from "../../models/Customer.ts";
import { fetchCustomers, submitNewCustomer } from "../../services/customerAPI.ts";

import { formatCurrency } from "../../utils/formatCurrency.ts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


type newCustomer = {
  name: string;
  phoneNumber: string;
  totalExpense: number;
  numberOfOrder: number;
  gender: boolean;
  birthday: Date | null;  // Có thể là null khi chưa có giá trị
  email: string;
  address: string;
};
export default function CustomerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [pageNum, setPageNum] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5); // Số khách hàng mỗi trang

  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const navigate = useNavigate();

  const [phoneError, setPhoneError] = useState<boolean>(false); // Trạng thái để lưu lỗi số điện thoại


  const [openModal, setOpenModal] = useState<boolean>(false);  // State để quản lý việc mở/đóng modal
  const [newCustomer, setNewCustomer] = useState<newCustomer>({
    name: '',
    phoneNumber: '',
    totalExpense: 0,
    numberOfOrder: 0,
    gender: false, // Default value for gender
    birthday: null, // You can set a default or leave as null for now
    email: '',  // Added email field
    address: '' // Added address field
  });
  const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái tải dữ liệu

  const loadCustomers = async () => {
    setIsLoading(true); // Bắt đầu tải dữ liệu
    try {
      const fetchedCustomers = await fetchCustomers(pageNum, pageSize, keyword);
      const sortedCustomers = fetchedCustomers.content.sort(
        (a: Customer, b: Customer) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
      );
      setCustomers(sortedCustomers);

      setTotalCustomers(fetchedCustomers.totalElements);

    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setCustomers([]); // Đảm bảo luôn là mảng
        setTotalCustomers(0);
        // toast.error("Không tồn tại khách hàng!"); // Hiển thị thông báo lỗi
      } else {
        console.error('Lỗi khi lấy danh sách khách hàng:', error);
        toast.error('Lỗi khi lấy danh sách khách hàng:', error);
        setCustomers([]); // Đảm bảo customers là mảng rỗng khi có lỗi
      }
    }
    setIsLoading(false); // Kết thúc tải dữ liệu
  };
  useEffect(() => {
    loadCustomers();
  }, [pageNum, pageSize, keyword]);
  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPageNum(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10)); // Cập nhật số hàng trên mỗi trang
    setPageNum(0); // Reset về trang đầu khi thay đổi số hàng
  };

  // Hàm xử lý khi người dùng nhấn phím
  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      setKeyword(searchTerm); // Cập nhật từ khóa và gọi API tìm kiếm
      setPageNum(0); // Reset lại trang đầu tiên
    }
  };



  // Xử lý mở modal
  const handleAddCustomerClick = () => {
    setOpenModal(true);  // Mở modal
  };


  // Xử lý đóng modal
  const handleCloseModal = () => {
    setOpenModal(false);  // Đóng modal
    setPhoneError(false);
    // Reset lại thông tin khách hàng
    setNewCustomer({
      name: '',
      phoneNumber: '',
      totalExpense: 0,
      numberOfOrder: 0,
      gender: false,
      birthday: null,
      email: '',
      address: ''
    });
  };

  const handleSubmitNewCustomer = async () => {
    if (newCustomer.name === '' || newCustomer.phoneNumber === '') {
      toast.error("Vui lòng nhập tên và số điện thoại khách hàng");
      return;
    }
    try {
      console.log("Thông tin khách hàng mới:", newCustomer);

      // Gọi API để tạo khách hàng mới
      const createdCustomer = await submitNewCustomer(newCustomer);
      console.log("Tạo khách hàng thành công:", createdCustomer);

      // setSuccessMessage("Tạo khách hàng thành công!"); // Thiết lập thông báo thành công
      setNewCustomer({
        name: '',
        phoneNumber: '',
        totalExpense: 0,
        numberOfOrder: 0,
        gender: false,
        birthday: null,
        email: '',
        address: ''
      });
      setPhoneError(false);
      setOpenModal(false);  // Đóng modal sau khi tạo thành công
      loadCustomers(); // Gọi lại API để cập nhật danh sách khách hàng
      toast.success("Tạo khách hàng thành công!");
      setOpenModal(false);
    } catch (error: any) {
      console.error("Lỗi khi tạo khách hàng:", error.message);
      // setErrorMessage(error.message); // Cập nhật thông báo lỗi
      if (error.message === 'Số điện thoại đã tồn tại') {
        setPhoneError(true); // Cập nhật trạng thái lỗi số điện thoại
      } else {
        toast.error(error.message);
      }
      // setNewCustomer({
      //     name: '',
      //     phoneNumber: '',
      //     totalExpense: 0,
      //     numberOfOrder: 0,
      //     gender: false,
      //     birthday: null,
      //     email: '',
      //     address: ''
      // });
    }

  };
  // Cập nhật state khi nhập dữ liệu vào form
  const handleChangeNewCustomer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCustomer({
      ...newCustomer,
      [e.target.name]: e.target.value
    });
  };

  const handleDetailsClick = (customerId: number) => {
    navigate(`/customers/${customerId}`); // Chuyển hướng tới trang chi tiết của khách hàng
  };




  return (
    <Box>
      <CustomerPageAppBar />
      <MainBox>

        <Box
          sx={{ padding: '24px' }}
          display="flex"
          justifyContent="flex-end"
          alignItems="center">
          <Button sx={{
            backgroundColor: 'primary.main', color: 'white', fontFamily: '"Segoe UI", sans-serif', // Phông chữ
            fontSize: '14px', // Kích thước chữ
            fontStyle: 'normal', // Kiểu chữ
            fontWeight: 600,
          }} onClick={handleAddCustomerClick}>+ Thêm khách hàng</Button>
        </Box>



        {/*thanh tìm kiếm và bảng listCustomers*/}
        <Box sx={{ background: '#FFFFFF', margin: '10px 20px' }}>
          <Box sx={{ padding: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm khách hàng theo tên hoặc SĐT"
              onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setSearchTerm(e.target.value)}  // Cập nhật giá trị tìm kiếm
              onKeyPress={handleKeyPress}  // Gắn sự kiện khi nhấn phím
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: '100%' }}
            />
          </Box>
          <Box sx={{ padding: '0 16px 16px 16px', borderRadius: '8px' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{}}>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Mã khách hàng</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Tên khách hàng</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Số điện thoại</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Tổng chi tiêu</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Tổng số đơn hàng</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? 
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow> :
                customers.length > 0 ?
                  customers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      sx={{// Hover effect
                        cursor: 'pointer'
                      }}
                      hover
                      onClick={() => handleDetailsClick(customer.id)}
                    >
                      <TableCell sx={{ color: '#08F' }}>{customer.code}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.phoneNumber}</TableCell>
                      <TableCell>{formatCurrency(customer.totalExpense)}</TableCell>
                      <TableCell>{customer.numberOfOrder}</TableCell>

                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">Không có khách hàng nào</TableCell>
                    </TableRow>
                  )}

              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={totalCustomers} // Tổng số lượng khách hàng
              page={pageNum}
              onPageChange={handleChangePage}
              rowsPerPage={pageSize}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Số hàng trên mỗi trang"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong tổng số ${count}`}
              rowsPerPageOptions={[5, 10]} // Các tùy chọn số hàng
              sx={{ mt: 2 }} // Margin top
            />
          </Box>


        </Box>
        {/* Modal Thêm khách hàng */}
        <Dialog sx={{ padding: '10px' }} open={openModal} onClose={handleCloseModal}>
          <DialogTitle sx={{ fontWeight: '700' }}>Thêm mới khách hàng </DialogTitle>
          <Divider />
          <DialogContent>
            <Grid container spacing={2}>
              {/* Tên khách hàng */}
              <Grid item xs={6}>
                <Typography variant="subtitle1">
                  Tên khách hàng
                  <Tooltip title="Bắt buộc" placement="top" arrow>
                    <span style={{ color: 'red', marginLeft: 4 }}>*</span>
                  </Tooltip>
                </Typography>
                <TextField

                  margin="dense"
                  name="name"
                  fullWidth
                  value={newCustomer.name}
                  onChange={handleChangeNewCustomer}
                />
              </Grid>

              {/* Số điện thoại */}
              <Grid item xs={6}>
                <Typography variant="subtitle1">
                  Số điện thoại
                  <Tooltip title="Bắt buộc" placement="top" arrow>
                    <span style={{ color: 'red', marginLeft: 4 }}>*</span>
                  </Tooltip>
                </Typography>
                <TextField
                  margin="dense"
                  name="phoneNumber"
                  fullWidth
                  value={newCustomer.phoneNumber}
                  error={phoneError}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChangeNewCustomer(e);
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
                <Typography variant="subtitle1">
                  Ngày sinh
                </Typography>
                <TextField
                  margin="dense"
                  name="birthday"
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={newCustomer.birthday}
                  onChange={handleChangeNewCustomer}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={6}>
                <Typography variant="subtitle1">
                  Email
                </Typography>
                <TextField
                  label="Email"
                  margin="dense"
                  name="email"
                  type="email"
                  fullWidth
                  value={newCustomer.email}
                  onChange={handleChangeNewCustomer}
                />
              </Grid>

              {/* Địa chỉ */}
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Địa chỉ
                </Typography>
                <TextField
                  margin="dense"
                  name="address"
                  fullWidth
                  value={newCustomer.address}
                  onChange={handleChangeNewCustomer}
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
                    value={newCustomer.gender ? "male" : "female"}  // Hiển thị đúng giới tính theo boolean
                    onChange={(e) => setNewCustomer({
                      ...newCustomer,
                      gender: e.target.value === "male"  // Cập nhật giá trị boolean
                    })}
                  >
                    <FormControlLabel value="male" control={<Radio />} label="Nam" />
                    <FormControlLabel value="female" control={<Radio />} label="Nữ" />

                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
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
              onClick={handleSubmitNewCustomer}
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

      </MainBox>
    </Box>
  )
}