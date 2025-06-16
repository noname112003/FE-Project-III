import React, { useState } from "react";
import "./styles.css";
import {IconEyeOff, IconEyeOpen, IconPass, IconPhone} from "./icon.tsx";
import {ComponentLeftLogin} from "./ComponentLeftLogin.tsx";
import {useNavigate} from "react-router-dom";
import {loginUser} from "../../services/userAPI.ts";
import {Alert} from "@mui/material";
import {getStores} from "../../services/storeAPI.ts";
import {setStores} from "../../reducers/storesReducer.tsx";
import {useDispatch} from "react-redux";
import {setStore} from "../../reducers/storeSettingReducer.tsx";

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError(false);
        console.log("Phone:", phoneNumber, "Password:", password);
        try {
            const data = await loginUser(phoneNumber, password);  // Gọi API từ hàm loginUser
            if (data.status === "OK") {
                setMessage("Login successful!");
                localStorage.setItem("token", data.data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        id: data.data.id,
                        name: data.data.name,
                        phoneNumber: data.data.phoneNumber,
                        roles: data.data.roles,
                        storeIds: data.data.storeIds,
                    })
                );

                const storesData = await getStores(data.data.id);  // Gọi API getStores với userId
                localStorage.setItem("stores",  JSON.stringify(storesData));
                dispatch(setStores(storesData));

                const firstStoreId = data.data.storeIds[0];
                const matchedStore = storesData.find((store: any) => store.id === firstStoreId);
                if (matchedStore) {
                    dispatch(setStore(matchedStore));
                }

                navigate('/');  // Chuyển hướng sau khi login thành công
            }
        } catch (error: any) {
            setError(true);
            setMessage(error.message);  // Hiển thị lỗi từ API
        }
    };

    return (
        <div className="loginContainer">
            <ComponentLeftLogin/>
            <div className="container">
                {/* Tabs */}
                <div className="tabContainer">
                    <div
                        className={`tab`}
                        // onClick={() => setActiveTab("owner")}
                    >
                        Đăng nhập
                    </div>
                    {/*<div*/}
                    {/*    className={`tab ${activeTab === "staff" ? "active" : ""}`}*/}
                    {/*    onClick={() => setActiveTab("staff")}*/}
                    {/*>*/}
                    {/*    Nhân viên*/}
                    {/*</div>*/}
                </div>
                {message && (
                    <Alert severity={error ? "error" : "success"}>{message}</Alert>
                )}
                {/* Form */}
                <form onSubmit={handleSubmit} className="form">
                        <div className="inputContainer">
                    <span className="icon">
                        <IconPhone/>
                    </span>
                            <span className="prefix">+84</span>
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Số điện thoại"
                                className="input"
                            />
                        </div>

                        <div className="inputContainer">
                    <span className="icon">
                        <IconPass/>
                    </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mật khẩu"
                                className="input"
                            />
                            {password ? (
                                <span
                                    className="toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                        {showPassword ? <IconEyeOpen/> : <IconEyeOff/>}
                    </span>
                            ) : null
                            }
                        </div>

                        <a href="#" className="forgotPassword">
                            Quên mật khẩu
                        </a>

                        <button type="submit" className="button">
                            Đăng nhập
                        </button>
                    </form>

            </div>
        </div>
    );
};

export default Login;
