import React, { useState } from "react";
import { Chip, InputBase, Paper } from "@mui/material";
import { Clear } from "@mui/icons-material";
import DeletePropertyDialog from "./product-detail/product-edit/DeletePropertyDialog";
import { deleteVariantByProperty } from "../../services/productAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
    badges: string[];
    setBadges: React.Dispatch<React.SetStateAction<string[]>>;
    fixedBadges?: string[];
    prop?: string;
    id?: string | undefined;
    onUpdate?:()=>void;
};

export default function Property({
    badges,
    setBadges,
    fixedBadges,
    prop,
    id,
    onUpdate,
}: Props) {
    const [inputValue, setInputValue] = useState("");
    const [selectedValue, setSelectedValue] = useState("");
    const [propToDelete, setPropToDelete] = useState("");
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const trimmedValue = inputValue.trim();
        if (e.key === "Enter" && trimmedValue) {
            // Check if the input value is already a badge
            if (
                !badges.includes(trimmedValue) &&
                !fixedBadges?.includes(trimmedValue)
            ) {
                setBadges((prevBadges) => [...prevBadges, trimmedValue]);
            }

            setInputValue("");
            e.preventDefault();
        }
    };

    // Remove badge handler
    function handleDeleteBadge(badgeToDelete: string) {
        setBadges((prevBadges) =>
            prevBadges.filter((badge) => badge !== badgeToDelete)
        );
    }
    function openDialogDelete(badgeToDelete: string) {
        let name = "";
        switch (prop) {
            case "size":
                name = "Kích cỡ";
                break;
            case "color":
                name = "Màu sắc";
                break;
            case "material":
                name = "Chất liệu";
                break;
        }
        setPropToDelete(name + ": " + badgeToDelete);
    }
    function handleDeleteVariantByProperty() {
        deleteVariantByProperty(id, prop, selectedValue)
            .then((_res) => {
                toast.success("Xóa phiên bản thành công");
                setSelectedValue("");
                if (onUpdate) {
                    onUpdate(); 
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    }
    return (
        <Paper
            component="form"
            sx={{
                display: "flex",
                alignItems: "center",
                padding: "2px 8px",
                flexWrap: "wrap",
                width: 400,
                border: "1px solid #ccc",
            }}
            onSubmit={(e) => e.preventDefault()}
        >
            {fixedBadges !== undefined && fixedBadges[0] !== "" ? (
                fixedBadges.map((badge, index) => (
                    <Chip
                        sx={{ margin: "2px", padding: "0 4px" }}
                        key={index}
                        label={badge}
                        onDelete={() => {
                            openDialogDelete(badge);
                            setSelectedValue(badge);
                        }}
                        deleteIcon={<Clear />}
                    />
                ))
            ) : (
                <></>
            )}
            {/* Rendering the badges (Chips) inside the input */}
            {badges.map((badge, index) => (
                <Chip
                    sx={{
                        margin: "2px",
                        padding: "0 4px",
                    }}
                    key={index}
                    label={badge}
                    onDelete={() => handleDeleteBadge(badge)}
                    deleteIcon={<Clear />}
                />
            ))}

            {/* InputBase for free-form text entry next to the badges */}
            <InputBase
                sx={{ flex: 1 }}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Gõ ký tự và nhấn Enter để thêm giá trị"
                inputProps={{ "aria-label": "input-with-badges" }}
            />
            {selectedValue.length > 0 ? (
                <DeletePropertyDialog
                    propToDelete={propToDelete}
                    setSelectedValue={setSelectedValue}
                    handleDeleteVariantByProperty={
                        handleDeleteVariantByProperty
                    }
                />
            ) : (
                <></>
            )}
        </Paper>
    );
}
