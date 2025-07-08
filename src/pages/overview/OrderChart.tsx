import { useEffect, useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";  // Import CSS của react-datepicker

const OrderChart = () => {
    const [data, setData] = useState<any[]>([]);  // State để lưu trữ dữ liệu từ API
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());  // State cho ngày chọn
    const store = useSelector((state: any) => state.storeSetting.store);
    const formatLocalDate = (date: Date) => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0'); // tháng bắt đầu từ 0
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    // Gọi API và lấy dữ liệu
    useEffect(() => {
        if (!selectedDate) return;  // Nếu không có ngày chọn thì không gọi API

        const currentDate = formatLocalDate(selectedDate); // Lấy định dạng yyyy-MM-dd
        console.log(currentDate); // Ví dụ: "2023-06-20"
        console.log("storeId: ", store?.id); // Kiểm tra giá trị store.id
        console.log("storeId type: ", typeof store?.id); // Kiểm tra kiểu của store.id

        const fetchData = async () => {
            try {
                const response = await axios.get('https://store-manager-ixub.onrender.com/v1/orders/count-by-day', {
                    params: {
                        storeId: store?.id,  // Bạn có thể thay đổi storeId theo yêu cầu
                        date: currentDate,  // Ngày cần lấy dữ liệu, thay đổi nếu cần
                    },
                });

                // Chuyển đổi dữ liệu từ API thành định dạng cho biểu đồ
                const formattedData = response.data.map((item: any) => ({
                    hour: `${item.hour < 10 ? '0' : ''}${item.hour}:00`,  // Định dạng lại giờ
                    orders: item.orderCount,
                }));

                setData(formattedData);  // Cập nhật state với dữ liệu
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [store, selectedDate]);  // Gọi lại API khi store hoặc selectedDate thay đổi

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ padding: "30px", display: 'flex', alignItems: 'center', gap: 2}}>
                <Typography sx={{fontSize: '26px', fontStyle: 'normal', fontWeight: 500,lineHeight: 'normal'  }} variant="h6" gutterBottom>
                    Số lượng đơn hàng theo giờ trong ngày
                </Typography>

                {/* Thay thế MUI DatePicker bằng react-datepicker */}
                <DatePicker
                    selected={selectedDate}
                    // onChange={(date: Date) => setSelectedDate(date)}
                    onChange={(date: Date | null, _event: any) => {
                        setSelectedDate(date);
                    }}
                    dateFormat="dd/MM/yyyy" 
                    customInput={<TextField fullWidth />}
                    popperPlacement="bottom-start"
                    wrapperClassName="datepicker-wrapper"
                />
            </Box>

            <Box style={{ backgroundColor: "white", margin: "30px", maxWidth: "100%", overflowX: "auto"  }}>
                <ResponsiveContainer style={{ padding: "30px 30px 30px 0" }} width="100%" height={500}>
                    <BarChart data={data} style={{top: 20, right: 0, bottom: 10, left: 0, backgroundColor: '#ffffff' }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                        <XAxis dataKey="hour" interval={0} tickSize={12}/>
                        <YAxis />
                        <Tooltip />
                        <Legend
                            formatter={() => 'Số lượng đơn hàng theo giờ trong ngày'}
                        />
                        <Bar dataKey="orders" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

export default OrderChart;
