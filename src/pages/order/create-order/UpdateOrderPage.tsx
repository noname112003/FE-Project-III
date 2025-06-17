import { Autocomplete, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, TableContainer, Button, Dialog, DialogTitle, DialogContent, FormControl, FormControlLabel, RadioGroup, Radio, CircularProgress } from "@mui/material"
import MainBox from "../../../components/layout/MainBox"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import {createCustomer, getCustomerById, getCustomersByKeyword} from "../../../services/customerAPI"
import Customer from "../../../models/Customer"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BadgeIcon from '@mui/icons-material/Badge';
import { getAllVariantsForSearch } from "../../../services/productAPI"
import InventoryIcon from '@mui/icons-material/Inventory';
import { formatCurrency } from "../../../utils/formatCurrency"
import OrderDetail from "../../../models/OrderDetail"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { getOrderDetailV2, updateOrder} from "../../../services/orderAPI"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from "dayjs"
import {useNavigate, useParams} from "react-router-dom"
import { useReactToPrint } from "react-to-print"
import { ReceiptToPrint } from "./Receipt"
import { NumericFormat } from "react-number-format"
import { useSelector} from "react-redux";
import {VariantResponse} from "../../../models/ProductInterface.tsx";
import Order from "../../../models/Order.ts";


type VariantTableRowProps = {
    index: number,
    orderDetailList: OrderDetail[],
    setOrderDetailList?: any
}

function VariantTableRow({ index, orderDetailList, setOrderDetailList }: VariantTableRowProps) {

    const orderDetail = orderDetailList[index];

    const handleDelete = () => {
        setOrderDetailList(orderDetailList.filter(item => item.sku !== orderDetail.sku));
    }

    return <TableRow key={orderDetail.variantId}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>
            {orderDetail.imagePath ? <img src={orderDetail.imagePath} alt="product" style={{ width: 50, height: 50, objectFit: 'cover' }} /> : null}
        </TableCell>
        <TableCell>{orderDetail.name}</TableCell>
        <TableCell>{formatCurrency(orderDetail.price)}</TableCell>
        <TableCell align="right">
            <TextField
                sx={{ textAlign: 'center' }}
                type="number"
                value={orderDetail.quantity}
                onChange={(event) => {
                    if(Number(event.target.value) > orderDetail.variantQuantity) {
                        toast.error("Số lượng sản phẩm đã vượt quá số lượng tồn kho");
                        return;
                    }
                    const newQuantity = Math.min(Math.max(Number(event.target.value), 1), orderDetail.variantQuantity);
                    setOrderDetailList(orderDetailList.map(item => item.sku === orderDetail.sku ? { ...item, quantity: newQuantity } : item));
                    return;
                }}
            />
        </TableCell>
        <TableCell align="right">{formatCurrency(orderDetail.price * orderDetail.quantity)}</TableCell>
        <TableCell align="right">
            <Button
                variant="text"
                color="error"
                onClick={handleDelete}
            >
                Xóa
            </Button>
        </TableCell>
    </TableRow>
}

type DialogProps = {
    open: boolean,
    handleClose: () => void
}

function NewCustomerDialog({ open, handleClose }: DialogProps) {

    const [name, setName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [birthday, setBirthday] = useState<Dayjs | null>(null);
    const [gender, setGender] = useState<boolean>(true);

    const handleCreateCustomer = () => {
        if(name === '' || phoneNumber === '') {
            toast.error("Vui lòng nhập tên và số điện thoại khách hàng");
            return;
        }
        const customer = {
            name: name,
            phoneNumber: phoneNumber,
            email: email,
            address: address,
            birthday: birthday ? birthday.toISOString() : null,
            gender: gender
        }
        createCustomer(customer).then((_res) => {
            toast.success("Thêm khách hàng thành công");
            handleClose();
        }).catch((error) => {
            toast.error(error.response.data);
        });
    }

    return <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Thêm khách hàng mới</DialogTitle>
        <DialogContent>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Box>
                    <Typography variant="body1" sx={{ color: '#000' }}>Tên khách hàng <span style={{ color: '#FF4D4D' }}>*</span></Typography>
                    <TextField sx={{ width: '300px' }} value={name} onChange={e => setName(e.target.value)} />
                </Box>
                <Box>
                    <Typography variant="body1" sx={{ color: '#000' }}>Số điện thoại <span style={{ color: '#FF4D4D' }}>*</span></Typography>
                    <TextField sx={{ width: '300px' }} value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Box>
                    <Typography variant="body1" sx={{ color: '#000' }}>Ngày sinh</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            sx={{ width: '300px' }}
                            value={birthday}
                            onChange={(value) => { setBirthday(value) }}
                            format="DD/MM/YYYY"
                        />
                    </LocalizationProvider>
                </Box>
                <Box>
                    <Typography variant="body1" sx={{ color: '#000' }}>Email</Typography>
                    <TextField sx={{ width: '300px' }} value={email} onChange={e => setEmail(e.target.value)} />
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Box sx={{ width: '100%' }}>
                    <Typography variant="body1" sx={{ color: '#000' }}>Địa chỉ</Typography>
                    <TextField sx={{ width: '100%' }} value={address} onChange={e => setAddress(e.target.value)} />
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
                <Box>
                    <Typography variant="body1" sx={{ color: '#000' }}>Giới tính</Typography>
                    <FormControl>
                        <RadioGroup
                            row
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                            value={gender}
                            onChange={(event) => setGender(event.target.value === 'true')}
                        >
                            <FormControlLabel value={false} control={<Radio />} label="Nam" />
                            <FormControlLabel value={true} control={<Radio />} label="Nữ" />
                        </RadioGroup>
                    </FormControl>
                </Box>
            </Box>
        </DialogContent>
        <Box display="flex" justifyContent="flex-end" p={2}>
            <Button variant="outlined" onClick={handleClose} sx={{ marginRight: '25px' }}>
                Thoát
            </Button>
            <Button variant="contained" onClick={handleCreateCustomer}>Thêm</Button>
        </Box>
    </Dialog>
}

type Props = {}

export default function UpdateOrderPage({ }: Props) {
    const { id } = useParams<{ id: string }>();

    const [openAddCustomerDialog, setOpenAddCustomerDialog] = useState<boolean>(false);

    const [customersList, setCustomersList] = useState<Customer[]>([]);
    const [customerKeyword, setCustomerKeyword] = useState<string>('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [variantQuery, setVariantQuery] = useState<string>('');
    const [variantList, setVariantList] = useState<VariantResponse[]>([]);
    const [orderDetailList, setOrderDetailList] = useState<OrderDetail[]>([]);
    const [totalQuantity, setTotalQuantity] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [cashReceived, setCashReceived] = useState<number>(0);
    const [note, setNote] = useState<string>('');
    const [doesCreatingOrder, setDoesCreatingOrder] = useState<boolean>(false);
    const [newOrderReceipt, setNewOrderReceipt] = useState<any>({
        createdOn: "",
        creatorId: 0,
        code: "",
        orderDetails: [],
        total: 0,
        cashReceive: 0,
        cashRepay: 0,
        note: ""
    });

    const [order, setOrder] = useState<Order>();
    useEffect(() => {
        getOrderDetailV2(id).then((res) => {
            setOrder(Order.fromJson(res.data));

            // Lấy mảng chi tiết order từ API và chuyển thành mảng OrderDetail
            if (res.data.orderDetails) {
                const orderDetailsList = OrderDetail.fromApiOrderDetails(res.data.orderDetails, res.data.id);
                setOrderDetailList(orderDetailsList);
            } else {
                setOrderDetailList([]); // Nếu không có orderDetails thì để mảng rỗng
            }
            setCashReceived(res.data.cashReceive);
            getCustomerById(res.data.customerId).then((res) => {
                if (res) {
                    setSelectedCustomer(res);
                }
            })
        })

    }, [id])

    const navigate = useNavigate();
    const store = useSelector((state: any) => state.storeSetting.store);
    const receiptRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => receiptRef.current,
        onAfterPrint: () => {
            navigate('/orders');
        }
    });


    useEffect(() => {
        getCustomersByKeyword(customerKeyword).then((res) => {
            setCustomersList(res);
        });
    }, [customerKeyword]);

    useEffect(() => {
        getAllVariantsForSearch(variantQuery, store?.id).then((res) => {
            setVariantList(res);
        });
    }, [variantQuery, store]);

    useLayoutEffect(() => {
        let totalQuantity = 0;
        let totalPrice = 0;
        orderDetailList.forEach((orderDetail) => {
            totalQuantity += orderDetail.quantity;
            totalPrice += orderDetail.quantity * orderDetail.price;
        });
        setTotalQuantity(totalQuantity);
        setTotalPrice(totalPrice);
    }, [orderDetailList]);

    const handleUpdateOrder = () => {
        if (!selectedCustomer) {
            toast.error("Vui lòng chọn khách hàng");
            return;
        }
        if (orderDetailList.length === 0) {
            toast.error("Vui lòng chọn sản phẩm");
            return;
        }
        if (cashReceived < totalPrice) {
            toast.error("Số tiền nhận của khách không đủ");
            return;
        }
        const newOrder = {
            customerId: selectedCustomer.id,
            storeId: store.id,
            creatorId: JSON.parse(localStorage.getItem('user') || '{}').id,
            totalQuantity: totalQuantity,
            note: note,
            cashReceive: cashReceived,
            cashRepay: cashReceived - totalPrice,
            totalPayment: totalPrice,
            paymentType: "CASH",
            orderLineItems: orderDetailList.map((orderDetail) => {
                return {
                    variantId: orderDetail.variantId,
                    quantity: orderDetail.quantity,
                    subTotal: orderDetail.quantity * orderDetail.price
                }
            }),
        }
        setDoesCreatingOrder(true);
        updateOrder(newOrder, order?.id).then((res) => {
            toast.success("Update đơn hàng thành công");
            setNewOrderReceipt(res.data.data);
            setTimeout(() => {
                handlePrint();
            }, 1000);
            setDoesCreatingOrder(false);
            // navigate('/order')
        }).catch((error) => {
            toast.error(error.response.data.message);
        });
    }

    return (
        <MainBox>
            <Box display="none">
                <ReceiptToPrint ref={receiptRef} order={newOrderReceipt}/>
            </Box>
            {/*<CreateOrderAppBar handleCreateOrder={handleCreateOrder} doesCreatingOrder={doesCreatingOrder}/>*/}
            <Box sx={{ backgroundColor: '#F0F1F1', padding: '25px 30px' }} flex={1} display='flex' flexDirection='column'>
                <NewCustomerDialog open={openAddCustomerDialog} handleClose={() => setOpenAddCustomerDialog(false)} />
                <Box bgcolor="#fff" borderRadius={1} padding="20px 15px" mb={2}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="body1" sx={{ color: '#000', fontWeight: '600', mb: 2 }}>Thông tin khách hàng</Typography>
                        <Button variant="outlined" sx={{ color: '#0088FF', mb: 2 }} onClick={() => setOpenAddCustomerDialog(true)}>Thêm khách hàng mới</Button>
                    </Box>
                    <Autocomplete
                        disablePortal
                        options={customersList}
                        getOptionLabel={(option: any) => option.name}
                        noOptionsText="Không tìm thấy khách hàng"
                        renderInput={(params) => <TextField {...params} placeholder="Tìm kiếm khách hàng theo tên, số điện thoại" />}
                        sx={{ width: '100%', mb: 2 }}
                        onChange={(_event: any, value: Customer | null) => {
                            setSelectedCustomer(value);
                        }}
                        value={selectedCustomer}
                        inputValue={customerKeyword}
                        onInputChange={(_event: any, newInputValue: string) => {
                            setCustomerKeyword(newInputValue);
                        }}
                        renderOption={(props, option) => {
                            const { key, ...rest } = props;
                            return <Box component="li" sx={{ '& > img': { mr: 2, borderRadius: '50%' } }} key={option.id} {...rest}>
                                <AccountCircleIcon sx={{ fontSize: 40, color: '#0088FF', mr: 2 }} />
                                <Box>
                                    <Typography variant="body1" sx={{ color: '#000', fontWeight: '600' }}>{option.name}</Typography>
                                    <Typography variant="body2" sx={{ color: '#747C87' }}>{option.phoneNumber}</Typography>
                                </Box>
                            </Box>
                        }}
                        filterOptions={(options, params) => {
                            const filtered = options.filter((option) => {
                                return option.name.toLowerCase().includes(params.inputValue.toLowerCase()) || option.phoneNumber.includes(params.inputValue);
                            });
                            return filtered;
                        }}
                    />
                    {selectedCustomer ?
                        <Box display="flex" justifyContent="space-between" border="1px solid #D9D9D9" p={1} borderRadius={1}>
                            <Box>
                                <Typography variant="body1" sx={{ color: '#000', fontWeight: '600' }} mb={1}>{selectedCustomer.name}</Typography>
                                <Typography variant="body2" sx={{ color: '#000' }} mb={1}>{selectedCustomer.phoneNumber}</Typography>
                                <Typography variant="body2" sx={{ color: '#000' }}>{selectedCustomer.address}</Typography>
                            </Box>
                            <Box border="1px dotted #D9D9D9" p={1}>
                                <Typography variant="body1" sx={{ color: '#000' }} mb={1}>Số đơn hàng: {selectedCustomer.numberOfOrder}</Typography>
                                <Typography variant="body1" sx={{ color: '#000' }}>Tổng chi tiêu: {formatCurrency(selectedCustomer.totalExpense)}</Typography>
                            </Box>
                        </Box> :
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <BadgeIcon sx={{ fontSize: 100, color: '#D9D9D9' }} />
                            <Typography variant="body2" sx={{ color: '#747C87' }}>Chưa có thông tin khách hàng</Typography>
                        </Box>
                    }
                </Box>
                <Box bgcolor="#fff" borderRadius={1} padding="20px 15px" mb={2}>
                    <Typography variant="body1" sx={{ color: '#000', fontWeight: '600', mb: 2 }}>Danh sách sản phẩm</Typography>
                    <Autocomplete
                        disablePortal
                        selectOnFocus
                        clearOnBlur
                        noOptionsText="Không tìm thấy sản phẩm"
                        options={variantList}
                        getOptionLabel={(option: any) => `${option.productName} (${option.name})`}
                        renderInput={(params) => <TextField {...params} placeholder="Tìm kiếm sản phẩm theo SKU, tên" />}
                        sx={{ width: '100%', mb: 2 }}
                        onChange={(_event: any, value: VariantResponse | null) => {
                            if(value?.quantity === 0) {
                                toast.error("Sản phẩm đã hết hàng");
                                return;
                            }
                            if (value && !orderDetailList.find((item: OrderDetail) => item.sku === value.sku)) {
                                setOrderDetailList([...orderDetailList, OrderDetail.fromVariant(value)]);
                            }
                        }}
                        inputValue={variantQuery}
                        onInputChange={(_event: any, newInputValue: string) => {
                            setVariantQuery(newInputValue);
                        }}
                        renderOption={(props, option) => {
                            const { key, ...rest } = props;
                            return <Box component="li" sx={{ '& > img': { mr: 2 } }} key={option.sku} {...rest} display="flex">
                                <Box flex={1}>
                                    <Typography variant="body1" sx={{ color: '#000', fontWeight: '600' }}>{`${option.name}`}</Typography>
                                    <Typography variant="body2" sx={{ color: '#747C87' }}>{option.sku}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" sx={{ color: '#000', fontWeight: '600', ml: 2 }}>{formatCurrency(option.priceForSale)}</Typography>
                                    <Typography variant="body2" sx={{ color: '#747C87', ml: 2 }}>{option?.variantStores[0]?.quantity || 0} sản phẩm</Typography>
                                </Box>
                            </Box>
                        }}
                        filterOptions={(options, params) => {
                            const filtered = options.filter((option) => {
                                return option.sku.toLowerCase().includes(params.inputValue.toLowerCase()) || option.name.toLowerCase().includes(params.inputValue.toLowerCase());
                            });
                            return filtered;
                        }}
                    />
                    {orderDetailList.length > 0 ?
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>STT</TableCell>
                                        <TableCell>Ảnh</TableCell>
                                        <TableCell>Sản phẩm</TableCell>
                                        <TableCell>Giá bán</TableCell>
                                        <TableCell align="right">Số lượng</TableCell>
                                        <TableCell align="right">Thành tiền</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        orderDetailList.map((_orderDetail, index) => <VariantTableRow key={index} index={index} orderDetailList={orderDetailList} setOrderDetailList={setOrderDetailList} />)
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer> :
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <InventoryIcon sx={{ fontSize: 100, color: '#D9D9D9' }} />
                            <Typography variant="body2" sx={{ color: '#747C87' }}>Chưa có sản phẩm nào được chọn</Typography>
                        </Box>
                    }
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" sx={{ color: '#000' }}>Ghi chú đơn hàng</Typography>
                        <TextField
                            value={note}
                            sx={{ width: '40%', mt: 1 }}
                            multiline
                            rows={4}
                            placeholder="Nhập ghi chú cho đơn hàng"
                            variant="outlined"
                            onChange={(event) => {
                                setNote(event.target.value);
                            }}
                        />
                    </Box>
                </Box>
                <Box bgcolor="#fff" borderRadius={1} padding="20px 15px" mb={2}>
                    <Typography variant="body1" sx={{ color: '#000', fontWeight: '600', mt: 2 }}>Thông tin thanh toán</Typography>
                    <Box width='40%' display="flex" justifyContent="space-between" mt={2}>
                        <Typography variant="body1" sx={{ color: '#000' }}>Số sản phẩm</Typography>
                        <Typography variant="body1" sx={{ color: '#000' }}>{totalQuantity}</Typography>
                    </Box>
                    <Box width='40%' display="flex" justifyContent="space-between" mt={2}>
                        <Typography variant="body1" sx={{ color: '#000' }}>Tổng tiền</Typography>
                        <Typography variant="body1" sx={{ color: '#000' }}>{formatCurrency(totalPrice)}</Typography>
                    </Box>
                    <Box mt={2} display="flex" alignItems="center">
                        <Typography variant="body1" sx={{ color: '#000' }} marginRight={2}>Phương thức thanh toán</Typography>
                        <Button variant="outlined">COD</Button>
                    </Box>
                    <Box width='40%' display="flex" alignItems="center">
                        <Typography variant="body1" sx={{ color: '#000' }} mt={2} marginRight={2}>Tiền nhận của khách</Typography>
                        <NumericFormat
                            customInput={TextField}
                            value={cashReceived}
                            onValueChange={(values) => {
                                const {value} = values;
                                setCashReceived(Number(value));
                            }}
                            thousandsGroupStyle="thousand"
                            thousandSeparator="."
                            decimalSeparator=","
                            style={{ marginTop: '8px', width: '200px' }}
                        />
                    </Box>
                    <Box width='40%' display="flex" justifyContent="space-between" mt={2}>
                        <Typography variant="body1" sx={{ color: '#000' }}>Tiền thừa</Typography>
                        <Typography variant="body1" sx={{ color: '#000' }}>{formatCurrency(cashReceived - totalPrice)}</Typography>
                    </Box>
                </Box>
                <Box mt={2} display="flex" justifyContent="flex-end">
                    {!doesCreatingOrder ?
                        <Button variant="contained" color="primary" onClick={handleUpdateOrder}>
                            Cập nhật đơn hàng
                        </Button> :
                        <Button variant="contained" color="primary">
                            <CircularProgress size={24} color="inherit"/>
                        </Button>
                    }
                </Box>
            </Box>
        </MainBox>
    )
}