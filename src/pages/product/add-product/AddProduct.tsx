import {
    Box,
    Button,
    CardMedia,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import MainBox from "../../../components/layout/MainBox";
import { Add, Image, Cancel, AddCircle } from "@mui/icons-material";
import AddProductAppBar from "./AddProductAppBar";
import { useEffect, useState } from "react";
import {
    BrandResponse,
    CategoryResponse,
    initialProductRequest,
    ProductRequest,
    VariantRequest,
} from "../../../models/ProductInterface";
import Property from "../Property";
import { storage } from "../../../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import NumericFormatCustom from "../../../utils/NumericFormatCustom";
import { createProduct } from "../../../services/productAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllBrands } from "../../../services/brandAPI";
import { getAllCategories } from "../../../services/categoryAPI";
import { useNavigate } from "react-router-dom";
import AddCategory from "../categories/AddCategory";
import AddBrand from "../brands/AddBrand";

type Props = {};

export default function AddProduct({}: Props) {
    const [newProduct, setNewProduct] = useState<ProductRequest>(
        initialProductRequest
    );
    const [priceForSale, setPriceForSale] = useState(0);
    const [initialPrice, setInitialPrice] = useState(0);
    const [sizes, setSizes] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [materials, setMaterials] = useState<string[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [brands, setBrands] = useState<BrandResponse[]>([]);
    const [variants, setVariants] = useState<VariantRequest[]>([]);
    const [nameError, setNameError] = useState<boolean>(false);
    const [images, setImages] = useState<string[]>([]);
    const [createCategory, setCreateCategory] = useState<boolean>(false);
    const [createBrand, setCreateBrand] = useState<boolean>(false);
    const navigate = useNavigate();

    function setAllInitialPrices(newInitialPrice: number) {
        const updatedVariants = variants.map((variant) => ({
            ...variant,
            initialPrice: newInitialPrice,
        }));
        setVariants(updatedVariants);
        setInitialPrice(newInitialPrice);
    }

    function setAllPriceForSale(newPriceForSale: number) {
        const updatedVariants: VariantRequest[] = variants.map((variant) => ({
            ...variant,
            priceForSale: newPriceForSale,
        }));
        setVariants(updatedVariants);
        setPriceForSale(newPriceForSale);
    }

    function handleDataChange(e: any) {
        if (e.target.value != -1) {
            const { name, value } = e.target;
            setNewProduct((prev) => ({
                ...prev,
                [name]: value,
            }));
            if (name === "name" && value.trim() === "") {
                setNameError(true);
            } else {
                setNameError(false);
            }
        }
    }

    // function handleVariantChange(index: number, field: string, value: string) {
    //     const updatedVariants = [...variants];
    //     updatedVariants[index] = {
    //         ...updatedVariants[index],
    //         [field]: field === "quantity" ? parseInt(value, 10) || 0 : value,
    //     };
    //     setVariants(updatedVariants);
    // }

    function handleVariantChange(index: number, field: string, value: string) {
        const updatedVariants = [...variants];

        if (field === "quantity") {
            const parsedValue = parseInt(value, 10) || 0;
            updatedVariants[index] = {
                ...updatedVariants[index],
                quantity: parsedValue,
                stock: parsedValue, // Cập nhật stock bằng quantity
            };
        } else {
            updatedVariants[index] = {
                ...updatedVariants[index],
                [field]: value,
            };
        }

        setVariants(updatedVariants);
    }

    // function handleTotalQuantity(e: any){
    //     if (e.target.value != -1) {
    //         const { name, value } = e.target;
    //         setNewProduct((prev) => ({
    //             ...prev,
    //             [name]: value,
    //         }));
    //         // handleVariantChange(0, "quantity", value);
    //     }
    // }


    function handleAddNewProduct() {
        if (newProduct.name.trim() !== "") {
            let updatedVariants: VariantRequest[] = [];
            if (variants.length == 0) {
                updatedVariants.push({
                    name: newProduct.name,
                    sku: "",
                    quantity: 0,
                    stock: 0,
                    size: "",
                    color: "",
                    material: "",
                    imagePath: images[0] || "",
                    priceForSale: priceForSale,
                    initialPrice: initialPrice,
                    status: true,
                    variantStores: [],
                });
            } else {
                updatedVariants = variants.map((variant) => {
                    return {
                        ...variant,
                        priceForSale:
                            variant.priceForSale == 0
                                ? priceForSale
                                : variant.priceForSale,
                        initialPrice:
                            variant.initialPrice == 0
                                ? initialPrice
                                : variant.initialPrice,
                    };
                });
            }
            // Cập nhật totalQuantity trong newProduct
            const totalQuantity = updatedVariants.reduce(
                (total, variant) => total + variant.quantity,
                0
            );

            createProduct({
                ...newProduct,
                totalQuantity: totalQuantity,
                stock: totalQuantity,
                variants: updatedVariants,
                imagePath: images,
            })
                .then((_res) => {
                    toast.success("Tạo sản phẩm thành công");
                    navigate(`/products/${_res.id}`);
                })
                .catch((error) => {
                    toast.error(error.response.data.message);
                });
        } else {
            toast.error("Tên sản phẩm không được trống.");
        }
    }

    function handleImageChange(
        e: React.ChangeEvent<HTMLInputElement>,
        directory: string,
        index?: number
    ) {
        const files: File[] = e.target.files ? Array.from(e.target.files) : [];
        files.map((file) => {
            if (!file) return;
            const storageRef = ref(storage, `${directory}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

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

    function loadAllCategories() {
        getAllCategories("").then((res) => {
            setCategories(res);
            setNewProduct((prev) => ({
                ...prev,
                categoryId: res[0].id,
            }));
        });
    }

    function loadAllBrands() {
        getAllBrands("").then((res) => {
            setBrands(res);
            setNewProduct((prev) => ({
                ...prev,
                brandId: res[0].id,
            }));
        });
    }

    useEffect(() => {
        getAllCategories("").then((res) => {
            setCategories(res);
        });
        getAllBrands("").then((res) => {
            setBrands(res);
        });
    }, []);

    useEffect(() => {
        if (sizes.length + colors.length + materials.length > 0) {
            const updatedVariants: VariantRequest[] = [];
            const validSizes = sizes.length ? sizes : [""];
            const validColors = colors.length ? colors : [""];
            const validMaterials = materials.length ? materials : [""];
            for (let i = 0; i < validSizes.length; i++) {
                for (let j = 0; j < validColors.length; j++) {
                    for (let k = 0; k < validMaterials.length; k++) {
                        const variant: VariantRequest = {
                            name:
                                newProduct.name +
                                    " - " +
                                    [sizes[i], colors[j], materials[k]]
                                        .filter(Boolean)
                                        .join(" - ") || " ",
                            sku: "",
                            quantity: 0,
                            stock: 0,
                            size: sizes[i] || "",
                            color: colors[j] || "",
                            material: materials[k] || "",
                            imagePath: "",
                            initialPrice: 0,
                            priceForSale: 0,
                            status: true,
                            variantStores: [],
                        };
                        updatedVariants.push(variant);
                    }
                }
            }

            setVariants(updatedVariants);
        } else {
            setVariants([]);
        }
    }, [sizes, materials, colors, newProduct.name]);
    return (
        <Box>
            <AddProductAppBar submit={handleAddNewProduct} />
            <MainBox>
                <Box sx={{ padding: "20px 24px", backgroundColor: "#F0F1F1" }}>
                    {/*<Box*/}
                    {/*    sx={{*/}
                    {/*        display: "flex",*/}
                    {/*        height: "60px",*/}
                    {/*        justifyContent: "space-between",*/}
                    {/*        alignItems: "center",*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <Typography sx={{ fontSize: "20px" }}>*/}
                    {/*        Thêm sản phẩm*/}
                    {/*        <span style={{ color: "#FF4D4D" }}>*</span>*/}
                    {/*    </Typography>*/}
                    {/*</Box>*/}
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
                                    <Typography sx={{ fontSize: "18px" }}>
                                        Thông tin sản phẩm
                                    </Typography>
                                </Box>
                                <Box sx={{ padding: "16px" }}>
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            Tên sản phẩm
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="name"
                                            value={newProduct.name}
                                            onChange={handleDataChange}
                                            error={nameError}
                                            helperText={
                                                nameError
                                                    ? "Tên sản phẩm là bắt buộc"
                                                    : ""
                                            }
                                            size="small"
                                        />
                                    </Box>
                                    <Box sx={{ mt: "15px" }}>
                                        <Typography
                                            sx={{
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            Mô tả sản phẩm
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            name="description"
                                            value={newProduct.description}
                                            onChange={handleDataChange}
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
                                    <Typography sx={{ fontSize: "18px" }}>
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
                                                color: "#000",
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            Giá bán
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={priceForSale}
                                            name="priceForSale"
                                            onChange={(e) => {
                                                setAllPriceForSale(
                                                    parseInt(e.target.value)
                                                );
                                            }}
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
                                                color: "#000",
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            Giá nhập
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={initialPrice}
                                            name="initialPrice"
                                            onChange={(e) => {
                                                setAllInitialPrices(
                                                    parseInt(e.target.value)
                                                );
                                            }}
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
                                    <Typography sx={{ fontSize: "18px" }}>
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
                                            badges={sizes}
                                            setBadges={setSizes}
                                            
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
                                            badges={colors}
                                            setBadges={setColors}
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
                                            badges={materials}
                                            setBadges={setMaterials}
                                        />
                                    </Box>
                                </Box>
                            </Box>
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
                                <Typography sx={{ fontSize: "18px" }}>
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
                                        id="category"
                                        name="categoryId"
                                        size="small"
                                        fullWidth
                                        value={
                                            newProduct.categoryId !== 0
                                                ? newProduct.categoryId
                                                : ""
                                        }
                                        onChange={handleDataChange}
                                    >
                                        <MenuItem value={-1}>
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
                                                    setCreateCategory(true)
                                                }
                                            >
                                                Thêm loại sản phẩm
                                            </Button>
                                        </MenuItem>
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
                                        id="brand"
                                        name="brandId"
                                        value={
                                            newProduct.brandId !== 0
                                                ? newProduct.brandId
                                                : ""
                                        }
                                        onChange={handleDataChange}
                                    >
                                        <MenuItem value={-1}>
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
                                                    setCreateBrand(true)
                                                }
                                            >
                                                Thêm nhãn hiệu
                                            </Button>
                                        </MenuItem>
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
                    {variants.length > 0 ? (
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
                                <Typography sx={{ fontSize: "20px" }}>
                                    Phiên bản
                                </Typography>
                                <Button></Button>
                            </Box>
                            {variants?.length > 0 ? (
                                <Box sx={{ padding: "16px" }}>
                                    <TableContainer component={Paper}>
                                        <Table
                                            sx={{ minWidth: 650 }}
                                            aria-label="simple table"
                                        >
                                            <TableHead
                                                sx={{
                                                    backgroundColor: "#F4F6F8",
                                                }}
                                            >
                                                <TableRow>
                                                    <TableCell></TableCell>
                                                    <TableCell width={"400px"}>
                                                        Tên phiên bản
                                                    </TableCell>
                                                    <TableCell
                                                        width={"200px"}
                                                        align="center"
                                                    >
                                                        Số lượng
                                                    </TableCell>
                                                    <TableCell
                                                        width={"200px"}
                                                        align="center"
                                                    >
                                                        Mã SKU
                                                    </TableCell>
                                                    <TableCell
                                                        width={"200px"}
                                                        align="center"
                                                    >
                                                        Giá bán
                                                    </TableCell>
                                                    <TableCell
                                                        width={"200px"}
                                                        align="center"
                                                    >
                                                        Giá nhập
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {variants.map(
                                                    (variant, index) => (
                                                        <TableRow
                                                            sx={{
                                                                "&:last-child td, &:last-child th":
                                                                    {
                                                                        border: 0,
                                                                    },
                                                            }}
                                                            key={index}
                                                        >
                                                            <TableCell>
                                                                <Box
                                                                    sx={{
                                                                        width: "100%",
                                                                        height: "100%",
                                                                        position:
                                                                            "relative",
                                                                        overflow:
                                                                            "hidden",
                                                                        display:
                                                                            "flex",
                                                                        justifyContent:
                                                                            "center",
                                                                        alignItems:
                                                                            "center",
                                                                    }}
                                                                >
                                                                    {variant.imagePath !==
                                                                    "" ? (
                                                                        <CardMedia
                                                                            component="img"
                                                                            sx={{
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
                                                                            color="disabled"
                                                                            sx={{
                                                                                width: 40,
                                                                                height: 40,
                                                                            }}
                                                                        />
                                                                    )}
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
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                            >
                                                                {[
                                                                    variant.size,
                                                                    variant.color,
                                                                    variant.material,
                                                                ]
                                                                    .filter(
                                                                        Boolean
                                                                    )
                                                                    .join(
                                                                        " - "
                                                                    )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <TextField
                                                                    type="number"
                                                                    fullWidth
                                                                    size="small"
                                                                    id="quantity"
                                                                    name="totalQuantity"
                                                                    value={variant.quantity || ""}
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        handleVariantChange(
                                                                            index,
                                                                            "quantity",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    }}
                                                                    placeholder="Nhập số lượng"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <TextField
                                                                    value={
                                                                        variant.sku ||
                                                                        ""
                                                                    }
                                                                    size="small"
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        handleVariantChange(
                                                                            index,
                                                                            "sku",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <TextField
                                                                    value={
                                                                        variant.priceForSale !=
                                                                        0
                                                                            ? variant.priceForSale
                                                                            : priceForSale
                                                                    }
                                                                    size="small"
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        handleVariantChange(
                                                                            index,
                                                                            "priceForSale",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    }}
                                                                    slotProps={{
                                                                        input: {
                                                                            inputComponent:
                                                                                NumericFormatCustom as any,
                                                                        },
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <TextField
                                                                    value={
                                                                        variant.initialPrice !=
                                                                        0
                                                                            ? variant.initialPrice
                                                                            : initialPrice
                                                                    }
                                                                    size="small"
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        handleVariantChange(
                                                                            index,
                                                                            "initialPrice",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    }}
                                                                    slotProps={{
                                                                        input: {
                                                                            inputComponent:
                                                                                NumericFormatCustom as any,
                                                                        },
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            ) : (
                                <></>
                            )}
                        </Box>
                    ) : (
                        <></>
                    )}
                </Box>
                {createCategory ? (
                    <AddCategory
                        setIsAdd={setCreateCategory}
                        onUpdate={loadAllCategories}
                    />
                ) : (
                    <></>
                )}
                {createBrand ? (
                    <AddBrand
                        setIsAdd={setCreateBrand}
                        onUpdate={loadAllBrands}
                    />
                ) : (
                    <></>
                )}
            </MainBox>
        </Box>
    );
}
