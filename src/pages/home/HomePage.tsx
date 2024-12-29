import { Box, Typography } from "@mui/material"
import HomePageAppBar from "./HomePageAppBar"
import MainBox from "../../components/layout/MainBox"

type Props = {}

export default function HomePage({}: Props) {
  return (
    <Box>
      <HomePageAppBar />
      <MainBox>
        <Typography variant="h3">Home Page</Typography>
        <Typography variant="body1">Welcome to the home page</Typography>
      </MainBox>
    </Box>
  )
}