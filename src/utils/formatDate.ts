export const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
        return 'N/A'; // Trả về 'N/A' nếu dateString là null hoặc rỗng
    }
    const date = new Date(dateString);

    // Lấy ngày, tháng và năm
    const day = String(date.getDate()).padStart(2, '0'); // Ngày
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng (tháng bắt đầu từ 0)
    const year = date.getFullYear(); // Năm

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Trả về định dạng "dd-mm-yyyy"
    return `${day}/${month}/${year} ${hours}:${minutes}`;

};
