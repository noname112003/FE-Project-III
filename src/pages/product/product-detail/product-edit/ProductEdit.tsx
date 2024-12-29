import {
    Box,
    Button,
    CardMedia,
    CircularProgress,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import ProductEditAppBar from "./ProductEditAppBar";
import MainBox from "../../../../components/layout/MainBox";
import { AddCircle, Add, Cancel, Image } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    BrandResponse,
    CategoryResponse,
    initialProductRequest,
    ProductRequest,
    VariantRequest,
} from "../../../../models/ProductInterface";
import Property from "../../Property";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../../../firebaseConfig";
import NumericFormatCustom from "../../../../utils/NumericFormatCustom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllCategories } from "../../../../services/categoryAPI";
import { getProductById, updateProduct } from "../../../../services/productAPI";
import { getAllBrands } from "../../../../services/brandAPI";

type Props = {};

export default function ProductDetail({}: Props) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<ProductRequest>(
        initialProductRequest
    );
    const [sizes, setSizes] = useState<string[]>([]);
    const [additionalSizes, setAdditionalSizes] = useState<string[]>([]);
    const [additionalColors, setAdditionalColors] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [materials, setMaterials] = useState<string[]>([]);
    const [additionalMaterials, setAdditionalMaterials] = useState<string[]>(
        []
    );
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [currentVariant, setCurrentVariant] = useState<number>(0);
    const [brands, setBrands] = useState<BrandResponse[]>([]);
    const [variants, setVariants] = useState<VariantRequest[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    function handleProductChange(e: any) {
        setProduct({ ...product, [e.target.name]: e.target.value });
    }

    function handleVariantChange(index: number, field: string, value: string) {
        const updatedVariants = [...variants];
        updatedVariants[index] = {
            ...updatedVariants[index],
            [field]: field === "quantity" ? parseInt(value, 10) || 0 : value,
        };
        setVariants(updatedVariants);
    }

    function setAllInitialPrices(newInitialPrice: number) {
        const updatedVariants = variants.map((variant) => ({
            ...variant,
            initialPrice: newInitialPrice,
        }));
        setVariants(updatedVariants);
    }

    function setAllPriceForSale(newPriceForSale: number) {
        const updatedVariants: VariantRequest[] = variants.map((variant) => ({
            ...variant,
            priceForSale: newPriceForSale,
        }));
        setVariants(updatedVariants);
    }

    function handleImageChange(
        e: React.ChangeEvent<HTMLInputElement>,
        directory: string,
        index?: number
    ) {
        const files: File[] = e.target.files ? Array.from(e.target.files) : [];
        files.map((file) => {
            if (!file) return;
            const storageRef = ref(storage, `${directory}/${file.name}`); // Create a reference to the file location
            const uploadTask = uploadBytesResumable(storageRef, file); // Upload the file

            // Monitor the upload progress
            uploadTask.on(
                "state_changed",
                (_snapshot) => {
                    //Clearing snapshot cannot upload images
                },
                (error) => {
                    console.error("Upload failed:", error);
                },
                () => {
                    // Handle successful upload
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        if (directory == "product")
                            setImages((prevImages) => [...prevImages, url]);
                        else if (index !== undefined) {
                            const updatedVariants = [...variants];
                            updatedVariants[index] = {
                                ...updatedVariants[index],
                                imagePath: url,
                            };
                            setVariants(updatedVariants);
                        }
                    });
                }
            );
        });
    }

    function handleRemoveImage(indexToRemove: number) {
        setImages((prev) => {
            return prev.filter((_, index) => index !== indexToRemove);
        });
    }
    function handleUpdateProduct() {
        console.log(variants);
        updateProduct(id, {
            ...product,
            variants: variants,
            imagePath: images,
        })
            .then((_res) => {
                toast.success("Cập nhật sản phẩm thành công");
                navigate(`/products/${_res.id}`);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    }

    function updateAfterDeleteProperty(){
        setLoading(true)
        getProductById(id)
            .then((res) => {
                
                setSizes(res.size);
                setColors(res.color);
                setMaterials(res.material);
                setVariants([...res.variants]);
               
            })
            .finally(() => setLoading(false));
    }
    useEffect(() => {
        getProductById(id)
            .then((res) => {
                setProduct(res);
                setSizes(res.size);
                setColors(res.color);
                setMaterials(res.material);
                setVariants([...res.variants]);
                setImages([...res.imagePath]);
            })
            .finally(() => setLoading(false));
        getAllCategories("").then((res) => {
            setCategories(res);
        });
        getAllBrands("").then((res) => {
            setBrands(res);
        });
    }, []);

    useEffect(() => {
        if (colors.length === 0 && additionalColors.length === 1) {
            setVariants((prevVariants) =>
                prevVariants.map((variant) => ({
                    ...variant,
                    color: additionalColors[0],
                }))
            );
        }
        if (colors.length === 0 && additionalColors.length === 0) {
            setVariants((prevVariants) =>
                prevVariants.map((variant) => ({
                    ...variant,
                    color: "",
                }))
            );
        }
        if (sizes.length === 0 && additionalSizes.length === 1) {
            setVariants((prevVariants) =>
                prevVariants.map((variant) => ({
                    ...variant,
                    size: additionalSizes[0],
                }))
            );
        }
        if (sizes.length === 0 && additionalSizes.length === 0) {
            setVariants((prevVariants) =>
                prevVariants.map((variant) => ({
                    ...variant,
                    size: "",
                }))
            );
        }
        if (materials.length === 0 && additionalMaterials.length === 1) {
            setVariants((prevVariants) =>
                prevVariants.map((variant) => ({
                    ...variant,
                    material: additionalMaterials[0],
                }))
            );
        }
        if (materials.length === 0 && additionalMaterials.length === 0) {
            setVariants((prevVariants) =>
                prevVariants.map((variant) => ({
                    ...variant,
                    material: "",
                }))
            );
        }
    }, [
        additionalColors,
        additionalMaterials,
        additionalSizes,
        colors,
        materials,
        sizes,
    ]);
    if (loading) {
        return (
            <Box>
                <ProductEditAppBar />
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
            <ProductEditAppBar id={id} submit={handleUpdateProduct} />
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
                            {product?.name}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: "24px" }}>
                        <Box sx={{ width: "70%" }}>
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
                                    <Typography
                                        sx={{
                                            fontSize: "18px",
                                        }}
                                    >
                                        Thông tin sản phẩm
                                    </Typography>
                                </Box>
                                <Box sx={{ padding: "16px" }}>
                                    <Box sx={{ width: "100%" }}>
                                        <Typography
                                            sx={{
                                                color: "#000",
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            Tên sản phẩm
                                            <span style={{ color: "#FF4D4D" }}>
                                                *
                                            </span>
                                        </Typography>
                                        <TextField
                                            required
                                            fullWidth
                                            name="name"
                                            value={product?.name}
                                            onChange={handleProductChange}
                                            size="small"
                                        />
                                    </Box>

                                    <Box sx={{ width: "100%", mt: "15px" }}>
                                        <Typography
                                            sx={{
                                                color: "#000",
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            Mô tả sản phẩm
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            name="description"
                                            value={product?.description}
                                            onChange={handleProductChange}
                                            rows={4}
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
                                        padding: "16px",
                                        height: "27px",
                                        borderBottom: "1px solid #d9d9d9",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mt: "24px",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "18px",
                                        }}
                                    >
                                        Ảnh sản phẩm
                                    </Typography>
                                    <Button
                                        variant="text"
                                        sx={{ textTransform: "none" }}
                                        onClick={() => setImages([])}
                                    >
                                        Xoá tất cả
                                    </Button>
                                </Box>
                                <Box
                                    sx={{
                                        padding: "20px 25px",
                                        display: "flex",
                                        gap: "20px",
                                    }}
                                >
                                    <Button
                                        sx={{
                                            border: "1px dashed #d9d9d9",
                                            borderRadius: 1,
                                            width: 100,
                                            height: 100,
                                            position: "relative",
                                            overflow: "hidden",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Add sx={{ color: "black" }} />
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleImageChange(e, "product")
                                            }
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
                                    </Button>
                                    {images.map((img, index) => (
                                        <Box
                                            sx={{
                                                position: "relative",
                                                "&:hover .remove-icon": {
                                                    visibility: "visible",
                                                },
                                                cursor: "pointer",
                                            }}
                                            key={index}
                                        >
                                            <CardMedia
                                                component="img"
                                                sx={{
                                                    borderRadius: 1,
                                                    width: 100,
                                                    height: 100,
                                                }}
                                                image={img}
                                            />
                                            <Cancel
                                                className="remove-icon"
                                                sx={{
                                                    position: "absolute",
                                                    flexGrow: 1,
                                                    visibility: "collapse",
                                                    top: 0,
                                                    right: 0,
                                                    width: "15px",
                                                    height: "15px",
                                                    backgroundColor: "white",
                                                    borderRadius: "50%",
                                                }}
                                                color="error"
                                                onClick={() =>
                                                    handleRemoveImage(index)
                                                }
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                            {sizes.length == 0 &&
                            colors.length == 0 &&
                            materials.length == 0 ? (
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
                                        <Typography sx={{ fontSize: "20px" }}>
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
                                        <TextField
                                            label="Giá bán"
                                            size="small"
                                            value={variants[0]?.priceForSale}
                                            name="priceForSale"
                                            onChange={(e) => {
                                                setAllPriceForSale(
                                                    parseInt(e.target.value)
                                                );
                                            }}
                                            sx={{ width: "50%" }}
                                            slotProps={{
                                                input: {
                                                    inputComponent:
                                                        NumericFormatCustom as any,
                                                },
                                            }}
                                        />
                                        <TextField
                                            label="Giá nhập"
                                            size="small"
                                            value={variants[0]?.initialPrice}
                                            name="initialPrice"
                                            onChange={(e) => {
                                                setAllInitialPrices(
                                                    parseInt(e.target.value)
                                                );
                                            }}
                                            sx={{ width: "50%" }}
                                            slotProps={{
                                                input: {
                                                    inputComponent:
                                                        NumericFormatCustom as any,
                                                },
                                            }}
                                        />
                                    </Box>
                                </Box>
                            ) : (
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
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mt: "24px",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: "18px",
                                            }}
                                        >
                                            Thuộc tính
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            padding: "20px 25px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "20px",
                                            width: "70%",
                                        }}
                                    >
                                        <Box sx={{ display: "flex" }}>
                                            <Typography
                                                fontWeight={"bold"}
                                                width={150}
                                            >
                                                Tên thuộc tính
                                            </Typography>
                                            <Typography
                                                fontWeight={"bold"}
                                                sx={{ flexGrow: 1 }}
                                            >
                                                Giá trị
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Typography
                                                fontSize={"0.9rem"}
                                                width={150}
                                            >
                                                Kích cỡ
                                            </Typography>
                                            <Property
                                                fixedBadges={sizes}
                                                badges={additionalSizes}
                                                setBadges={setAdditionalSizes}
                                                prop="size"
                                                id={id}
                                                onUpdate={updateAfterDeleteProperty}
                                            />
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Typography
                                                fontSize={"0.9rem"}
                                                width={150}
                                            >
                                                Màu sắc
                                            </Typography>
                                            <Property
                                                fixedBadges={colors}
                                                badges={additionalColors}
                                                setBadges={setAdditionalColors}
                                                prop="color"
                                                id={id}
                                                onUpdate={updateAfterDeleteProperty}
                                            />
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Typography
                                                fontSize={"0.9rem"}
                                                width={150}
                                            >
                                                Chất liệu
                                            </Typography>
                                            <Property
                                                fixedBadges={materials}
                                                badges={additionalMaterials}
                                                setBadges={
                                                    setAdditionalMaterials
                                                }
                                                prop="material"
                                                id={id}
                                                onUpdate={updateAfterDeleteProperty}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                        <Box
                            sx={{
                                borderRadius: "5px",
                                backgroundColor: "white",
                                flexGrow: 1,
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
                                <Typography
                                    sx={{
                                        fontSize: "18px",
                                    }}
                                >
                                    Phân loại
                                </Typography>
                            </Box>
                            <Box sx={{ padding: "16px" }}>
                                <Box>
                                    <Typography
                                        sx={{
                                            color: "#000",
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        Loại sản phẩm
                                    </Typography>
                                    <Select
                                        fullWidth
                                        size="small"
                                        id="category"
                                        name="categoryId"
                                        value={
                                            product?.categoryId !== undefined
                                                ? product?.categoryId
                                                : ""
                                        }
                                        onChange={handleProductChange}
                                    >
                                        {categories?.map((category) => (
                                            <MenuItem
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                                <Box sx={{ mt: "15px" }}>
                                    <Typography
                                        sx={{
                                            color: "#000",
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        Nhãn hiệu
                                    </Typography>
                                    <Select
                                        fullWidth
                                        size="small"
                                        labelId="brand"
                                        id="brand"
                                        name="brandId"
                                        value={
                                            product?.brandId !== undefined
                                                ? product?.brandId
                                                : ""
                                        }
                                        onChange={handleProductChange}
                                    >
                                        {brands?.map((brand) => (
                                            <MenuItem
                                                key={brand.id}
                                                value={brand.id}
                                            >
                                                {brand.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    {sizes.length == 0 &&
                    colors.length == 0 &&
                    materials.length == 0 ? (
                        <Box
                            sx={{
                                mt: "24px",
                                borderRadius: "5px",
                                backgroundColor: "white",
                                height: "fit-content",
                            }}
                        >
                            <Box
                                sx={{
                                    padding: "16px",
                                    height: "27px",
                                    borderBottom: "1px solid #d9d9d9",
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "18px",
                                    }}
                                >
                                    Phiên bản
                                </Typography>
                                <Button
                                    startIcon={
                                        <AddCircle
                                            sx={{
                                                width: 20,
                                                height: 20,
                                            }}
                                            color="primary"
                                        />
                                    }
                                    sx={{ textTransform: "none" }}
                                    variant="text"
                                    onClick={() =>
                                        navigate(
                                            `/products/${id}/variants/create`
                                        )
                                    }
                                >
                                    Thêm phiên bản
                                </Button>
                            </Box>
                            <Box
                                sx={{
                                    padding: "20px",
                                    height: 100,
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography color="textDisabled">
                                    Sản phẩm hiện chưa có phiên bản nào.
                                </Typography>
                            </Box>
                        </Box>
                    ) : (
                        <Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    height: "60px",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography sx={{ fontSize: "20px" }}>
                                    Chi tiết phiên bản
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
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography sx={{ fontSize: "18px" }}>
                                            Phiên bản
                                        </Typography>
                                        <Button></Button>
                                    </Box>
                                    {variants?.length > 0 ? (
                                        variants.map((variant, index) => (
                                            <Box
                                                sx={{ padding: "3px" }}
                                                key={variant.id}
                                                onClick={() =>
                                                    setCurrentVariant(index)
                                                }
                                            >
                                                <Box
                                                    sx={{
                                                        backgroundColor:
                                                            currentVariant ==
                                                            index
                                                                ? "#1976d2"
                                                                : "#fff",
                                                        padding: "16px",
                                                        height: "40px",
                                                        display: "flex",
                                                        gap: "10px",
                                                        borderRadius: "3px",
                                                    }}
                                                >
                                                    {variant.imagePath.length >
                                                    0 ? (
                                                        <CardMedia
                                                            component="img"
                                                            sx={{
                                                                padding:
                                                                    "0 10px",
                                                                width: 40,
                                                                height: 40,
                                                            }}
                                                            image={
                                                                variant.imagePath
                                                            }
                                                            alt="Paella dish"
                                                        />
                                                    ) : (
                                                        <Image
                                                            sx={{
                                                                padding:
                                                                    "0 10px",
                                                                width: 40,
                                                                height: 40,
                                                                color:
                                                                    currentVariant ==
                                                                    index
                                                                        ? "#fff"
                                                                        : "#d9d9d9",
                                                            }}
                                                        />
                                                    )}
                                                    <Box>
                                                        <Typography
                                                            fontSize={"0.9rem"}
                                                            sx={{
                                                                color:
                                                                    currentVariant ==
                                                                    index
                                                                        ? "#fff"
                                                                        : "#000",
                                                            }}
                                                        >
                                                            {[
                                                                variant.size,
                                                                variant.color,
                                                                variant.material,
                                                            ]
                                                                .filter(Boolean)
                                                                .join(" - ") ||
                                                                ""}
                                                        </Typography>
                                                        <Typography
                                                            fontSize={"0.9rem"}
                                                            sx={{
                                                                color:
                                                                    currentVariant ==
                                                                    index
                                                                        ? "#fff"
                                                                        : "#000",
                                                            }}
                                                        >
                                                            Tồn kho:{" "}
                                                            {variant.quantity}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ))
                                    ) : (
                                        <></>
                                    )}
                                    <Box
                                        sx={{
                                            borderTop: "1px solid #d9d9d9",
                                            height: "60px",
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Button
                                            startIcon={
                                                <AddCircle
                                                    sx={{
                                                        width: 20,
                                                        height: 20,
                                                    }}
                                                    color="primary"
                                                />
                                            }
                                            sx={{ textTransform: "none" }}
                                            variant="text"
                                            onClick={() =>
                                                navigate(
                                                    `/products/${id}/variants/create`
                                                )
                                            }
                                        >
                                            Thêm phiên bản
                                        </Button>
                                    </Box>
                                </Box>
                                {variants.map((variant, index) =>
                                    currentVariant == index ? (
                                        <Box sx={{ flexGrow: 1 }} key={index}>
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
                                                        borderBottom:
                                                            "1px solid #d9d9d9",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: "20px",
                                                        }}
                                                    >
                                                        Thông tin chi tiết phiên
                                                        bản
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: "flex" }}>
                                                    <Box
                                                        sx={{
                                                            width: "60%",
                                                            padding: "16px",
                                                            display: "flex",
                                                            flexDirection:
                                                                "column",
                                                            gap: "15px",
                                                        }}
                                                    >
                                                        <Box>
                                                            <Typography
                                                                sx={{
                                                                    color: "#000",
                                                                    fontSize:
                                                                        "0.9rem",
                                                                }}
                                                            >
                                                                Tên phiên bản
                                                                <span
                                                                    style={{
                                                                        color: "#FF4D4D",
                                                                    }}
                                                                >
                                                                    *
                                                                </span>
                                                            </Typography>
                                                            <TextField
                                                                required
                                                                value={
                                                                    variant?.name
                                                                }
                                                                onChange={(e) =>
                                                                    handleVariantChange(
                                                                        index,
                                                                        "name",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                fullWidth
                                                                size="small"
                                                            />
                                                        </Box>
                                                        <Box>
                                                            <Typography
                                                                sx={{
                                                                    color: "#000",
                                                                    fontSize:
                                                                        "0.9rem",
                                                                }}
                                                            >
                                                                Mã SKU
                                                            </Typography>
                                                            <TextField
                                                                value={
                                                                    variant?.sku
                                                                }
                                                                onChange={(e) =>
                                                                    handleVariantChange(
                                                                        index,
                                                                        "sku",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                sx={{
                                                                    width: "50%",
                                                                }}
                                                                size="small"
                                                            />
                                                        </Box>
                                                        <Box>
                                                            <Typography
                                                                sx={{
                                                                    color: "#000",
                                                                    fontSize:
                                                                        "0.9rem",
                                                                }}
                                                            >
                                                                Số lượng
                                                            </Typography>
                                                            <TextField
                                                                type="number"
                                                                sx={{ width: "50%" }}
                                                                size="small"
                                                                id="quantity"
                                                                name="quantity"
                                                                value={variant?.quantity || ""}
                                                                onChange={(e) =>
                                                                    handleVariantChange(
                                                                        index,
                                                                        "quantity",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Nhập số lượng"
                                                            />
                                                        </Box>
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            flexGrow: 1,
                                                            display: "flex",
                                                            justifyContent:
                                                                "center",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                mt: 2,
                                                                display: "flex",
                                                                flexDirection:
                                                                    "column",
                                                                justifyContent:
                                                                    "center",
                                                            }}
                                                        >
                                                            {variant.imagePath
                                                                .length > 0 ? (
                                                                <CardMedia
                                                                    component="img"
                                                                    sx={{
                                                                        borderRadius: 1,
                                                                        width: 100,
                                                                        height: 100,
                                                                    }}
                                                                    image={
                                                                        variant.imagePath
                                                                    }
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
                                                                    textTransform:
                                                                        "none",
                                                                    position:
                                                                        "relative",
                                                                    overflow:
                                                                        "hidden",
                                                                }}
                                                            >
                                                                <input
                                                                    type="file"
                                                                    multiple
                                                                    accept="image/*"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleImageChange(
                                                                            e,
                                                                            "variant",
                                                                            index
                                                                        )
                                                                    }
                                                                    style={{
                                                                        position:
                                                                            "absolute",
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
                                                        borderBottom:
                                                            "1px solid #d9d9d9",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        Thuộc tính
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        padding: "16px",
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    {sizes.length > 0 ||
                                                    additionalSizes.length >
                                                        0 ? (
                                                        <Box
                                                            sx={{
                                                                width: "48.5%",
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    color: "#000",
                                                                    fontSize:
                                                                        "0.9rem",
                                                                }}
                                                            >
                                                                Kích cỡ
                                                                <span
                                                                    style={{
                                                                        color: "#FF4D4D",
                                                                    }}
                                                                >
                                                                    *
                                                                </span>
                                                            </Typography>
                                                            <Select
                                                                fullWidth
                                                                id="size"
                                                                size="small"
                                                                value={
                                                                    variant?.size !==
                                                                    undefined
                                                                        ? variant?.size
                                                                        : additionalSizes.length >
                                                                            0
                                                                          ? additionalSizes[0]
                                                                          : ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleVariantChange(
                                                                        index,
                                                                        "size",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            >
                                                                {[
                                                                    ...sizes,
                                                                    ...additionalSizes,
                                                                ].map(
                                                                    (
                                                                        size,
                                                                        index
                                                                    ) => (
                                                                        <MenuItem
                                                                            value={
                                                                                size
                                                                            }
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            {
                                                                                size
                                                                            }
                                                                        </MenuItem>
                                                                    )
                                                                )}
                                                            </Select>
                                                        </Box>
                                                    ) : (
                                                        <></>
                                                    )}
                                                    {colors.length > 0 ||
                                                    additionalColors.length >
                                                        0 ? (
                                                        <Box
                                                            sx={{
                                                                width: "48.5%",
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    color: "#000",
                                                                    fontSize:
                                                                        "0.9rem",
                                                                }}
                                                            >
                                                                Màu sắc
                                                                <span
                                                                    style={{
                                                                        color: "#FF4D4D",
                                                                    }}
                                                                >
                                                                    *
                                                                </span>
                                                            </Typography>
                                                            <Select
                                                                fullWidth
                                                                size="small"
                                                                id="color"
                                                                value={
                                                                    variant?.color !==
                                                                    undefined
                                                                        ? variant?.color
                                                                        : additionalColors.length >
                                                                            0
                                                                          ? additionalColors[0]
                                                                          : ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleVariantChange(
                                                                        index,
                                                                        "color",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            >
                                                                {[
                                                                    ...colors,
                                                                    ...additionalColors,
                                                                ].map(
                                                                    (
                                                                        color,
                                                                        index
                                                                    ) => (
                                                                        <MenuItem
                                                                            value={
                                                                                color
                                                                            }
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            {
                                                                                color
                                                                            }
                                                                        </MenuItem>
                                                                    )
                                                                )}
                                                            </Select>
                                                        </Box>
                                                    ) : (
                                                        <></>
                                                    )}
                                                    {materials.length > 0 ||
                                                    additionalMaterials.length >
                                                        0 ? (
                                                        <Box
                                                            sx={{
                                                                width: "48.5%",
                                                                mt: "15px",
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    color: "#000",
                                                                    fontSize:
                                                                        "0.9rem",
                                                                }}
                                                            >
                                                                Chất liệu
                                                                <span
                                                                    style={{
                                                                        color: "#FF4D4D",
                                                                    }}
                                                                >
                                                                    *
                                                                </span>
                                                            </Typography>
                                                            <Select
                                                                fullWidth
                                                                size="small"
                                                                id="material"
                                                                value={
                                                                    variant?.material !==
                                                                    undefined
                                                                        ? variant?.material
                                                                        : additionalMaterials.length >
                                                                            0
                                                                          ? additionalMaterials[0]
                                                                          : ""
                                                                }
                                                                defaultValue={
                                                                    variant?.material !==
                                                                    undefined
                                                                        ? variant?.material
                                                                        : additionalMaterials.length >
                                                                            0
                                                                          ? additionalMaterials[0]
                                                                          : ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleVariantChange(
                                                                        index,
                                                                        "material",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            >
                                                                {[
                                                                    ...materials,
                                                                    ...additionalMaterials,
                                                                ].map(
                                                                    (
                                                                        material,
                                                                        index
                                                                    ) => (
                                                                        <MenuItem
                                                                            value={
                                                                                material
                                                                            }
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            {
                                                                                material
                                                                            }
                                                                        </MenuItem>
                                                                    )
                                                                )}
                                                            </Select>
                                                        </Box>
                                                    ) : (
                                                        <></>
                                                    )}
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
                                                        borderBottom:
                                                            "1px solid #d9d9d9",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: "18px",
                                                        }}
                                                    >
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
                                                    <Box
                                                        sx={{
                                                            width: "50%",
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                color: "#000",
                                                                fontSize:
                                                                    "0.9rem",
                                                            }}
                                                        >
                                                            Giá bán
                                                        </Typography>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            value={
                                                                variant?.priceForSale
                                                            }
                                                            onChange={(e) =>
                                                                handleVariantChange(
                                                                    index,
                                                                    "priceForSale",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            slotProps={{
                                                                input: {
                                                                    inputComponent:
                                                                        NumericFormatCustom as any,
                                                                },
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            width: "50%",
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                color: "#000",
                                                                fontSize:
                                                                    "0.9rem",
                                                            }}
                                                        >
                                                            Giá nhập
                                                        </Typography>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            value={
                                                                variant?.initialPrice
                                                            }
                                                            onChange={(e) =>
                                                                handleVariantChange(
                                                                    index,
                                                                    "initialPrice",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
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
                                    ) : (
                                        <></>
                                    )
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>
            </MainBox>
        </Box>
    );
}
