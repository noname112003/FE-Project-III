import React, {useEffect, useRef, useState} from 'react';
import { newFormatCurrency } from "../../../utils/formatCurrency.ts";
import {toast} from "react-toastify";
import {getPaymentLink} from "../../../services/orderAPI.ts";
import * as https from "node:https";

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    handleCancelOrder: (orderId: number) => void;
    amount: number;
    accountNumber: string;
    accountName: string;
    orderId: number;
    descreiption: string;
    createOrderFn: () => Promise<void>;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({accountName, createOrderFn, isOpen, onClose, handleCancelOrder, amount, accountNumber, orderId, descreiption }) => {
    if (!isOpen) return null;

    const qrUrl: string = `https://img.vietqr.io/image/MB-${accountNumber}-vietqr_pro.jpg?amount=${amount}&addInfo=${descreiption}`;

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isPaid, setIsPaid] = useState(false);

    useEffect(() => {
        if (isOpen && orderId) {
            // Bắt đầu polling mỗi giây
            intervalRef.current = setInterval(async () => {
                try {
                    const res = await getPaymentLink(orderId);
                    const status = res?.data?.status;

                    console.log("Trạng thái đơn hàng:", status);

                    if (status === "PAID") {
                        clearInterval(intervalRef.current!);
                        setIsPaid(true);
                        // Gọi API tạo đơn và chờ hoàn thành
                        (async () => {
                            try {
                                await createOrderFn();
                            } catch (e) {
                                toast.error("Tạo đơn hàng thất bại sau khi thanh toán");
                                console.error(e);
                            } finally {
                                onClose();
                                setIsPaid(false);
                            }
                        })();
                    } else if (status === "CANCELLED") {
                        toast.error("Đơn hàng đã bị huỷ");
                        clearInterval(intervalRef.current!);
                        onClose();
                    }
                    // Nếu là PENDING thì tiếp tục
                } catch (error) {
                    console.error("Lỗi khi kiểm tra trạng thái:", error);
                }
            }, 1000);
        }

        // Dọn dẹp interval khi đóng modal
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isOpen, orderId]);
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 50,
            }}
        >
            {isPaid ?
                (
                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            padding: '24px',
                            borderRadius: '1rem',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                            width: '90%',
                            maxWidth: '32rem',
                            position: 'relative',
                        }}
                    >
                        <div style={{textAlign: 'center'}}>
                            <SuccessIcon/>
                            <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>
                                Đơn hàng của bạn đã được thanh toán thành công
                            </h2>
                            <p style={{color: '#4B5563', marginTop: '0.5rem'}}>
                                Đang xử lý đơn hàng...
                            </p>
                        </div>
                    </div>
                ) :
                (
                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            padding: '24px',
                            borderRadius: '1rem',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                            width: '90%',
                            maxWidth: '750px',
                            position: 'relative',
                        }}
                    >
                        {/*<h2*/}
                        {/*    style={{*/}
                        {/*        fontSize: '1.25rem',*/}
                        {/*        fontWeight: 600,*/}
                        {/*        textAlign: 'center',*/}
                        {/*        marginBottom: '0.5rem',*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    Quét mã QR để thanh toán*/}
                        {/*</h2>*/}
                        {/*<p*/}
                        {/*    style={{*/}
                        {/*        textAlign: 'center',*/}
                        {/*        color: '#4B5563',*/}
                        {/*        marginBottom: '1rem',*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    Số tiền: <strong>{newFormatCurrency(amount)} VND</strong>*/}
                        {/*</p>*/}
                        {/*<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1.5rem'}}>*/}
                        {/*    <img*/}
                        {/*        src={qrUrl}*/}
                        {/*        alt="QR Code thanh toán"*/}
                        {/*        style={{width: '16rem', height: '16rem'}}*/}
                        {/*    />*/}
                        {/*</div>*/}
                        {/*<div style={{display: 'flex', justifyContent: 'center'}}>*/}
                        {/*    <button*/}
                        {/*        onClick={() => {*/}
                        {/*            clearInterval(intervalRef.current!);*/}
                        {/*            onClose();*/}
                        {/*            handleCancelOrder(orderId);*/}
                        {/*        }}*/}
                        {/*        style={{*/}
                        {/*            backgroundColor: '#EF4444',*/}
                        {/*            color: '#ffffff',*/}
                        {/*            padding: '0.5rem 1.5rem',*/}
                        {/*            borderRadius: '0.5rem',*/}
                        {/*            border: 'none',*/}
                        {/*            cursor: 'pointer',*/}
                        {/*            transition: 'background-color 0.2s ease',*/}
                        {/*        }}*/}
                        {/*        onMouseOver={(e) =>*/}
                        {/*            (e.currentTarget.style.backgroundColor = '#DC2626')*/}
                        {/*        }*/}
                        {/*        onMouseOut={(e) =>*/}
                        {/*            (e.currentTarget.style.backgroundColor = '#EF4444')*/}
                        {/*        }*/}
                        {/*    >*/}
                        {/*        Huỷ thanh toán*/}
                        {/*    </button>*/}
                        {/*</div>*/}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                width: "100%",
                                gap: '2rem',
                            }}
                        >
                            {/* Cột bên trái: QR code */}
                            <div style={{width: "50%", textAlign: 'center'}}>
                                <img
                                    src={qrUrl}
                                    alt="QR Code thanh toán"
                                    style={{width: '350px', height: '350px', marginBottom: '1rem'}}
                                />
                                <button
                                    onClick={() => {
                                        clearInterval(intervalRef.current!);
                                        onClose();
                                        handleCancelOrder(orderId);
                                    }}
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid #CBD5E1',
                                        color: 'rgb(107 114 128)',
                                        padding: '8px 20px',
                                        borderRadius: '0.375rem',
                                        fontSize: '14px', fontWeight: "600",
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s ease',
                                    }}
                                    onMouseOver={(e) =>
                                        (e.currentTarget.style.backgroundColor = '#F1F5F9') // hover light gray
                                    }
                                    onMouseOut={(e) =>
                                        (e.currentTarget.style.backgroundColor = 'transparent')
                                    }
                                >
                                    Huỷ
                                </button>
                            </div>

                            {/* Cột bên phải: Thông tin ngân hàng */}
                            <div style={{width: "50%", padding: "20px 0", fontSize: '15px', lineHeight: 1.5}}>
                                <div style={{display: "flex"}}>
                                    <div style={{paddingRight: "12px", alignContent: "center"}}>
                                        <img  style={{width: "30px", height: "30px"}} src="https://img.bankhub.dev/rounded/mbbank.png"/>
                                    </div>

                                    <div>
                                        <div style={{fontFamily: 'Arial, sans-serif', color: "rgb(85 85 85)"}}>Ngân hàng:</div>
                                        <div style={{fontFamily: 'Arial, sans-serif', fontWeight: "700"}}>Ngân hàng TMCP Quân đội</div>
                                    </div>
                                </div>
                                <div style={{margin: "8px 0px"}}>
                                    <div style={{fontFamily: 'Arial, sans-serif', color: "rgb(85 85 85)"}}>Chủ tài
                                        khoản:
                                    </div>
                                    <div
                                        style={{fontFamily: 'Arial, sans-serif', fontWeight: "700"}}>{accountName}</div>
                                </div>
                                <div style={{margin: "8px 0px"}}>
                                    <div style={{fontFamily: 'Arial, sans-serif', color: "rgb(85 85 85)"}}>Số tài
                                        khoản:
                                    </div>
                                    <div style={{
                                        fontFamily: 'Arial, sans-serif',
                                        fontWeight: "700"
                                    }}>{accountNumber}</div>
                                </div>
                                <div style={{margin: "8px 0px"}}>
                                    <div style={{fontFamily: 'Arial, sans-serif', color: "rgb(85 85 85)"}}>Số tiền:
                                    </div>
                                    <div style={{
                                        fontFamily: 'Arial, sans-serif',
                                        fontWeight: "700"
                                    }}>{newFormatCurrency(amount)} VND
                                    </div>
                                </div>
                                <div style={{margin: "8px 0px"}}>
                                    <div style={{fontFamily: 'Arial, sans-serif', color: "rgb(85 85 85)"}}>Nội dung:
                                    </div>
                                    <div style={{
                                        fontFamily: 'Arial, sans-serif',
                                        fontWeight: "700"
                                    }}>{descreiption}</div>
                                </div>
                                <p style={{marginTop: '1rem', fontFamily: 'Arial, sans-serif'}}>
                                    Lưu ý: Nhập chính xác số tiền <strong>{newFormatCurrency(amount)}</strong> khi
                                    chuyển khoản
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default QRCodeModal;

export const SuccessIcon = () => {
    return (
        <svg
            width="93"
            height="93"
            viewBox="0 0 93 93"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6.44858 28.2243L9.1208 29.6812L6.44858 31.138L4.98614 33.8037L3.51987 31.138L0.847656 29.6812L3.51987 28.2243L4.98614 25.5586L6.44858 28.2243Z"
                fill="url(#paint0_linear_1648_30065)"
            />
            <path
                d="M47.6687 1.26232L48.9397 1.95641L47.6687 2.64668L46.9758 3.909L46.2828 2.64668L45.0156 1.95641L46.2828 1.26232L46.9758 0L47.6687 1.26232Z"
                fill="url(#paint1_linear_1648_30065)"
            />
            <path
                d="M89.9681 29.0661L92.6442 30.523L89.9681 31.9798L88.5057 34.6455L87.0432 31.9798L84.3672 30.523L87.0432 29.0661L88.5057 26.4004L89.9681 29.0661Z"
                fill="url(#paint2_linear_1648_30065)"
            />
            <rect
                x="15.3047"
                y="17.5996"
                width="58.8932"
                height="58.6667"
                rx="29.3333"
                fill="white"
            />
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M15.3047 46.9329C15.3047 30.7409 28.4968 17.5996 44.7513 17.5996C61.0058 17.5996 74.1979 30.7409 74.1979 46.9329C74.1979 63.125 61.0058 76.2663 44.7513 76.2663C28.4968 76.2663 15.3047 63.125 15.3047 46.9329ZM38.862 53.2983L58.2673 33.9677L62.4192 38.133L38.862 61.5997L27.0833 49.8663L31.2353 45.7303L38.862 53.2983Z"
                fill="url(#paint3_linear_1648_30065)"
            />
            <g filter="url(#filter0_f_1648_30065)">
                <ellipse
                    cx="44.918"
                    cy="85.1286"
                    rx="15.7852"
                    ry="1.62667"
                    fill="black"
                    fill-opacity="0.25"
                />
            </g>
            <defs>
                <filter
                    id="filter0_f_1648_30065"
                    x="23.209"
                    y="77.5781"
                    width="43.418"
                    height="15.1016"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation="2.96192"
                        result="effect1_foregroundBlur_1648_30065"
                    />
                </filter>
                <linearGradient
                    id="paint0_linear_1648_30065"
                    x1="0.843828"
                    y1="29.6812"
                    x2="9.12463"
                    y2="29.6812"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#FF8E00" />
                    <stop offset="1" stop-color="#FFCF01" />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_1648_30065"
                    x1="45.0156"
                    y1="1.95641"
                    x2="48.9397"
                    y2="1.95641"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#5278FF" />
                    <stop offset="1" stop-color="#30B8FC" />
                </linearGradient>
                <linearGradient
                    id="paint2_linear_1648_30065"
                    x1="2528.31"
                    y1="1156.23"
                    x2="2707.26"
                    y2="1156.23"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#5278FF" />
                    <stop offset="1" stop-color="#30B8FC" />
                </linearGradient>
                <linearGradient
                    id="paint3_linear_1648_30065"
                    x1="44.7513"
                    y1="17.5996"
                    x2="44.7513"
                    y2="76.2663"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#23CB89" />
                    <stop offset="1" stop-color="#06925B" />
                </linearGradient>
            </defs>
        </svg>
    );
};