import { Typography, Box } from "@mui/material";
import MainAppBar from "../../../components/layout/MainAppBar";
import AccountSection from '../AccountSection'

type Props = {};

export default function VariantPageAppBar({}: Props) {
    return (
        <MainAppBar>
            <Box sx={{ display: "flex",width: "100%", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: "26px" }} color="textPrimary">
                    Danh sách phiên bản
                </Typography>
                <AccountSection/>
            </Box>
        </MainAppBar>
    );
}