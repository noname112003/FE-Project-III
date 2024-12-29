import { Box, Typography } from "@mui/material";

type Props = {
    label: string;
    info: string;
};

export default function ProductDetail({ label, info }: Props) {
    return(
    <Box sx={{display:'flex'}}>
        <Typography variant="body1" fontSize={"0.9rem"} width={"149px"}>
            {label}
        </Typography>
        <Typography fontSize={"0.9rem"}>:&nbsp;</Typography>
        <Typography variant="body1" fontSize={"0.9rem"} width={"200px"}>
            {info}
        </Typography>
    </Box>
    )
}
