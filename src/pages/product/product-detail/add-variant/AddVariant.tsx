import {
    Box,
    Button,
    CardMedia,
    CircularProgress,
    TextField,
    Typography,
} from "@mui/material";
import MainBox from "../../../../components/layout/MainBox";
import { Image } from "@mui/icons-material";
import AddVariantAppBar from "./AddVariantAppBar";
import { useEffect, useState } from "react";
import {
    initialProductResponse,
    initialVariantRequest,
    ProductResponse,
    VariantRequest,
} from "../../../../models/ProductInterface";
import { useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../../../firebaseConfig";
import NumericFormatCustom from "../../../../utils/NumericFormatCustom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createVariant, getProductById } from "../../../../services/productAPI";

type Props = {};

export default function AddVariant({}: Props) {
    const { id } = useParams();
    const [product, setProduct] = useState<ProductResponse>(
        initialProductResponse
    );
    const [newVariant, setNewVariant] = useState<VariantRequest>(
        initialVariantRequest
    );
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    // const [image,setImage] =useState<string>("");

    useEffect(() => {
        getProductById(id, null)
            .then((res) => {
                setProduct(res);
                setNewVariant({
                    name: res.name,
                    sku: "",
                    size: "",
                    color: "",
                    material: "",
                    imagePath: "",
                    initialPrice: 0,
                    priceForSale: 0,
                    quantity: 0,
                    status: true,
                });
            })
            .finally(() => setLoading(false));
    }, []);

    function handleVariantChange(e: any) {
        setNewVariant({ ...newVariant, [e.target.name]: e.target.value });
    }

    function handleAddNewVariant() {
        createVariant(id, newVariant)
            .then((_res) => {
                toast.success("Tạo phiên bản mới thành công");
                navigate(`/products/${_res.productId}/edit`);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file: File | undefined = e.target.files
            ? Array.from(e.target.files).at(0)
            : undefined;
        if (file) {
            const storageRef = ref(storage, `variants/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (_snapshot) => {
                    //Clearing snapshot cannot upload images
                },
                (error) => {
                    console.error("Upload failed:", error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        setNewVariant({ ...newVariant, imagePath: url });
                    });
                }
            );
        }
    }
    console.log(newVariant);
    if (loading) {
        return (
            <Box>
                <AddVariantAppBar />
                <MainBox>
                    <Box
                        sx={{
                            padding: "20px 24px",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                </MainBox>
            </Box>
        );
    }
    return (
        <Box>
            <AddVariantAppBar id={id} submit={handleAddNewVariant} />
            <MainBox>
                <Box sx={{ padding: "20px 24px", backgroundColor: "#F0F1F1" }}>
                    <Box
                        sx={{
                            display: "flex",
                            height: "60px",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography sx={{ fontSize: "20px" }}>
                            Thêm phiên bản cho {product?.name}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: "24px" }}>
                        <Box
                            sx={{
                                borderRadius: "5px",
                                backgroundColor: "white",
                                width: "35%",
                                height: "fit-content",
                            }}
                        >
                            <Box
                                sx={{
                                    padding: "16px",
                                    height: "27px",
                                    borderBottom: "1px solid #d9d9d9",
                                }}
                            >
                                <Typography sx={{ fontSize: "18px" }}>
                                    Phiên bản
                                </Typography>
                            </Box>
                            {product?.size?.length == 0 &&
                            product?.color?.length == 0 &&
                            product?.material?.length == 0 ? (
                                <Box sx={{ padding: "3px" }}>
                                    <Box
                                        sx={{
                                            padding: "16px",
                                            height: "40px",
                                            display: "flex",
                                            gap: "10px",
                                            borderRadius: "3px",
                                        }}
                                    >
                                        {newVariant?.imagePath?.length > 0 ? (
                                            <CardMedia
                                                component="img"
                                                sx={{
                                                    padding: "0 10px",
                                                    width: 40,
                                                    height: 40,
                                                }}
                                                image={newVariant.imagePath}
                                                alt="Paella dish"
                                            />
                                        ) : (
                                            <Image
                                                color="disabled"
                                                sx={{
                                                    padding: "0 10px",
                                                    width: 40,
                                                    height: 40,
                                                }}
                                            />
                                        )}
                                        <Box>
                                            <Typography fontSize={"0.9rem"}>
                                                {[
                                                    newVariant.size,
                                                    newVariant.color,
                                                    newVariant.material,
                                                ]
                                                    .filter(Boolean)
                                                    .join(" - ")}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ) : (
                                product?.variants?.map((variant) => (
                                    <Box
                                        sx={{ padding: "3px" }}
                                        key={variant.id}
                                    >
                                        <Box
                                            sx={{
                                                // backgroundColor: "#08f",
                                                padding: "16px",
                                                height: "40px",
                                                display: "flex",
                                                gap: "10px",
                                                borderRadius: "3px",
                                            }}
                                        >
                                            {variant?.imagePath?.length > 0 ? (
                                                <CardMedia
                                                    component="img"
                                                    sx={{
                                                        padding: "0 10px",
                                                        width: 40,
                                                        height: 40,
                                                    }}
                                                    image={variant.imagePath}
                                                    alt="Paella dish"
                                                />
                                            ) : (
                                                <Image
                                                    color="disabled"
                                                    sx={{
                                                        padding: "0 10px",
                                                        width: 40,
                                                        height: 40,
                                                    }}
                                                />
                                            )}
                                            <Box>
                                                <Typography
                                                    fontSize={"0.9rem"}
                                                    // sx={{ color: "white" }}
                                                >
                                                    {[
                                                        variant.size ||
                                                            newVariant.size,
                                                        variant.color ||
                                                            newVariant.color,
                                                        variant.material ||
                                                            newVariant.material,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" - ")}
                                                </Typography>
                                                <Typography
                                                    fontSize={"0.9rem"}
                                                    // sx={{ color: "white" }}
                                                >
                                                    Tồn kho: {variant.quantity}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))
                            )}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                            <Box
                                sx={{
                                    borderRadius: "5px",
                                    backgroundColor: "white",
                                }}
                            >
                                <Box
                                    sx={{
                                        padding: "16px",
                                        height: "27px",
                                        borderBottom: "1px solid #d9d9d9",
                                    }}
                                >
                                    <Typography sx={{ fontSize: "18px" }}>
                                        Thông tin chi tiết phiên bản
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex" }}>
                                    <Box
                                        sx={{
                                            width: "60%",
                                            padding: "16px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px",
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontSize: "0.9rem",
                                                }}
                                            >
                                                Tên phiên bản
                                                <span
                                                    style={{ color: "#FF4D4D" }}
                                                >
                                                    *
                                                </span>
                                            </Typography>
                                            <TextField
                                                name="name"
                                                value={newVariant.name || ""}
                                                onChange={handleVariantChange}
                                                fullWidth
                                                size="small"
                                            />
                                        </Box>
                                        <Box sx={{ mt: "15px" }}>
                                            <Typography
                                                sx={{
                                                    fontSize: "0.9rem",
                                                }}
                                            >
                                                Mã SKU
                                            </Typography>
                                            <TextField
                                                sx={{ width: "50%" }}
                                                value={newVariant.sku}
                                                name="sku"
                                                onChange={handleVariantChange}
                                                size="small"
                                            />
                                        </Box>
                                        <Box sx={{ mt: "15px"}}>
                                            <Typography sx={{fontSize: "0.9rem"}}>
                                                Số lượng
                                            </Typography>
                                            <TextField
                                                type="number"
                                                sx={{ width: "50%" }}
                                                size="small"
                                                id="quantity"
                                                name="quantity"
                                                value={newVariant.quantity || ""}
                                                onChange={handleVariantChange}
                                                placeholder="Nhập số lượng"
                                            />
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            flexGrow: 1,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                mt: 2,
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {newVariant?.imagePath?.length >
                                            0 ? (
                                                <CardMedia
                                                    component="img"
                                                    sx={{
                                                        borderRadius: 1,
                                                        width: 100,
                                                        height: 100,
                                                    }}
                                                    image={newVariant.imagePath}
                                                    alt="Paella dish"
                                                />
                                            ) : (
                                                <Image
                                                    color="disabled"
                                                    sx={{
                                                        width: 100,
                                                        height: 100,
                                                    }}
                                                />
                                            )}
                                            <Button
                                                variant="text"
                                                color="primary"
                                                sx={{
                                                    textTransform: "none",
                                                    position: "relative",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    style={{
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0,
                                                        width: "100%",
                                                        height: "100%",
                                                        opacity: 0,
                                                        cursor: "pointer",
                                                    }}
                                                />
                                                Thay đổi ảnh
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    borderRadius: "5px",
                                    backgroundColor: "white",
                                }}
                            >
                                <Box
                                    sx={{
                                        mt: "24px",
                                        padding: "16px",
                                        height: "27px",
                                        borderBottom: "1px solid #d9d9d9",
                                    }}
                                >
                                    <Typography sx={{ fontSize: "18px" }}>
                                        Thuộc tính
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        padding: "16px",
                                        rowGap: "20px",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box sx={{ width: "48.5%" }}>
                                        <Typography
                                            sx={{
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            Kích cỡ
                                            {product?.size?.length > 0 ? (
                                                <span
                                                    style={{ color: "#FF4D4D" }}
                                                >
                                                    *
                                                </span>
                                            ) : (
                                                <></>
                                            )}
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="size"
                                            size="small"
                                            value={newVariant.size}
                                            onChange={handleVariantChange}
                                        />
                                    </Box>

                                    <Box sx={{ width: "48.5%" }}>
                                        <Typography
                                            sx={{
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            Màu sắc
                                            {product?.color?.length > 0 ? (
                                                <span
                                                    style={{ color: "#FF4D4D" }}
                                                >
                                                    *
                                                </span>
                                            ) : (
                                                <></>
                                            )}
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="color"
                                            size="small"
                                            value={newVariant.color}
                                            onChange={handleVariantChange}
                                        />
                                    </Box>

                                    <Box sx={{ width: "48.5%", mt: "15px" }}>
                                        <Typography
                                            sx={{
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            Chất liệu
                                            {product?.material?.length > 0 ? (
                                                <span
                                                    style={{ color: "#FF4D4D" }}
                                                >
                                                    *
                                                </span>
                                            ) : (
                                                <></>
                                            )}
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="material"
                                            size="small"
                                            value={newVariant.material}
                                            onChange={handleVariantChange}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    borderRadius: "5px",
                                    backgroundColor: "white",
                                }}
                            >
                                <Box
                                    sx={{
                                        mt: "24px",
                                        padding: "16px",
                                        height: "27px",
                                        borderBottom: "1px solid #d9d9d9",
                                    }}
                                >
                                    <Typography sx={{ fontSize: "18px" }}>
                                        Giá sản phẩm
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        padding: "16px",
                                        gap: "20px",
                                    }}
                                >
                                    <Box sx={{ width: "50%" }}>
                                        <Typography
                                            sx={{
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            Giá bán
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={newVariant.priceForSale}
                                            name="priceForSale"
                                            onChange={handleVariantChange}
                                            slotProps={{
                                                input: {
                                                    inputComponent:
                                                        NumericFormatCustom as any,
                                                },
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ width: "50%" }}>
                                        <Typography
                                            sx={{
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            Giá nhập
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            onChange={handleVariantChange}
                                            size="small"
                                            value={newVariant.initialPrice}
                                            name="initialPrice"
                                            slotProps={{
                                                input: {
                                                    inputComponent:
                                                        NumericFormatCustom as any,
                                                },
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </MainBox>
        </Box>
    );
}
