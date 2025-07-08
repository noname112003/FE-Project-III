import { Outlet } from "react-router-dom"
import HomeDrawer from "../components/drawer/HomeDrawer"
import { Box } from "@mui/material"
import { ToastContainer } from 'react-toastify';
import {useEffect} from "react";
import { getStoresV2} from "../services/storeAPI.ts";
import {useDispatch} from "react-redux";
import {setStores} from "../reducers/storesReducer.tsx";
import {setStore} from "../reducers/storeSettingReducer.tsx";

type Props = {}

export default function HomeLayout({}: Props) {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("user") as string);
    useEffect(() => {
        const fetchStores = async () => {
            const storesData = await getStoresV2(Number(user.id),  true);
            localStorage.setItem("stores", JSON.stringify(storesData));
            dispatch(setStores(storesData));
            dispatch(setStore(storesData[0]));
        };

        fetchStores();
    }, []);

  return (
    <Box sx={{display: 'flex', backgroundColor: "#F0F1F1", height: "100vh"}}>
      <HomeDrawer />
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <ToastContainer hideProgressBar autoClose={3000} />
    </Box>
  )
}