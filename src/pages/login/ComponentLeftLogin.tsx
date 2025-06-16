import "./styles.css";
export const ComponentLeftLogin = () => {
    return (
        <div className="cpnLeftLogin">
            <img
                className="logo"
                src="https://bizweb.dktcdn.net/100/102/351/files/bglogin.png?v=1717664539370"
                alt="bg-login"
            />
            <div style={{ marginTop: "42px" }}>
                <p style={{ textAlign: 'center', paddingBottom: '5px', margin: '0 0', fontWeight: 600, fontSize: '14px' }}>
                    Phần mềm quản lý dịch vụ ăn uống dễ sử dụng nhất
                </p>
                <p style={{ margin: '0 0', fontWeight: 400, fontSize: '14px' }}>
                    <span style={{ display: 'block' }}>Tính tiền nhanh chóng & vận hành ổn định với phần mềm</span>
                    <span style={{ display: 'block', textAlign: 'center' }}>quản lý quán ăn được 230,000+ khách hàng tin dùng</span>
                </p>
            </div>
            {/* </div> */}
        </div>
    );
};