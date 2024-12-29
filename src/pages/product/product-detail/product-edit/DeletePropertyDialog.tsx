import { Box, Button, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";

type Props = {
    propToDelete: string;
    setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
    handleDeleteVariantByProperty: () => void;
};

export default function DeletePropertyDialog({
    propToDelete,
    setSelectedValue,
    handleDeleteVariantByProperty,
}: Props) {
    return (
        <Box
            sx={{
                position: "fixed",
                zIndex: 10,
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    backgroundColor: "white",
                    width: "600px",
                    height: "auto",
                    padding: "10px 30px 30px 30px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    border: "1px solid black",
                    borderRadius: "5px",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 0",
                        borderBottom: "1px solid #d9d9d9",
                    }}
                >
                    <Typography variant="h5">Xóa thuộc tính</Typography>
                    <Close color="disabled" />
                </Box>
                <Typography>
                    Thao tác này sẽ xoá phiên bản có thuộc tính {propToDelete}{" "}
                    và không thể khôi phục. Bạn có chắc chắn muốn xoá không?
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "25px",
                    }}
                >
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => setSelectedValue("")}
                    >
                        Thoát
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteVariantByProperty()}
                    >
                        Xóa
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
