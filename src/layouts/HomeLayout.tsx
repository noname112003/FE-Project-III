import { Outlet } from "react-router-dom"
import HomeDrawer from "../components/drawer/HomeDrawer"
import { Box } from "@mui/material"
import { ToastContainer } from 'react-toastify';

type Props = {}

export default function HomeLayout({}: Props) {
  return (
    <Box sx={{display: 'flex'}}>
      <HomeDrawer />
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <ToastContainer hideProgressBar autoClose={3000} />
    </Box>
  )
}