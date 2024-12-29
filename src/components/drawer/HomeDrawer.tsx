import { Collapse, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material"
import DrawerItem from "./DrawerItem"
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.webp';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

type Props = {}

export default function HomeDrawer({ }: Props) {
  const [openOrder, setOpenOrder] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);

  const navigate = useNavigate();

  return (
    <Drawer sx={{
      width: 240,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: 240,
        boxSizing: 'border-box',
      },
    }}
      PaperProps={{
        sx: {
          backgroundColor: '#182537',
        }
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar>
        <img src={logo} alt="logo" width="80%" />
      </Toolbar>
      <Divider />
      <List sx={{ p: 0 }}>
        <DrawerItem name="Tổng quan" icon={<HomeIcon />} link="/" />
        <ListItemButton onClick={() => setOpenOrder(!openOrder)}>
          <ListItemIcon sx={{ color: "#fff" }}>
            <ReceiptLongIcon />
          </ListItemIcon>
          <ListItemText sx={{ color: "#fff" }} primary="Đơn hàng" />
          {openOrder ? <ExpandLess style={{ color: '#fff' }}/> : <ExpandMore style={{ color: '#fff' }}/>}
        </ListItemButton>
        <Collapse in={openOrder} timeout="auto" unmountOnExit>
          <List disablePadding>
            <ListItemButton sx={{ pl: 4, color: '#fff' }} onClick={() => navigate('/orders/create')}>
              <ListItemText primary="Tạo đơn hàng" />
            </ListItemButton>
          </List>
          <List disablePadding>
            <ListItemButton sx={{ pl: 4, color: '#fff' }}>
              <ListItemText primary="Danh sách đơn hàng" onClick={() => navigate('/orders')}/>
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton onClick={() => setOpenProduct(!openProduct)}>
          <ListItemIcon sx={{ color: "#fff" }}>
            <InventoryIcon />
          </ListItemIcon>
          <ListItemText sx={{ color: "#fff" }} primary="Sản phẩm" />
          {openProduct ? <ExpandLess style={{ color: '#fff' }}/> : <ExpandMore style={{ color: '#fff' }}/>}
        </ListItemButton>
        <Collapse in={openProduct} timeout="auto" unmountOnExit>
          <List disablePadding>
            <ListItemButton sx={{ pl: 4, color: '#fff' }}>
              <ListItemText primary="Danh sách sản phẩm" onClick={() => navigate('/products')}/>
            </ListItemButton>
          </List>
          <List disablePadding>
            <ListItemButton sx={{ pl: 4, color: '#fff' }}>
              <ListItemText primary="Quản lý danh mục" onClick={() => navigate('/products/categories')}/>
            </ListItemButton>
          </List>
          <List disablePadding>
            <ListItemButton sx={{ pl: 4, color: '#fff' }}>
              <ListItemText primary="Quản lý nhãn hiệu" onClick={() => navigate('/products/brands')}/>
            </ListItemButton>
          </List>
          <List disablePadding>
            <ListItemButton sx={{ pl: 4, color: '#fff' }}>
              <ListItemText primary="Quản lý phiên bản" onClick={() => navigate('/products/variants')}/>
            </ListItemButton>
          </List>
        </Collapse>
        <DrawerItem name="Khách hàng" icon={<PersonIcon style={{ color: '#fff' }} />} link="/customers"/>
        <DrawerItem name="Nhân viên" icon={<ManageAccountsIcon style={{ color: '#fff' }} />} link="/admin/user"/>
      </List>
    </Drawer>
  )
}