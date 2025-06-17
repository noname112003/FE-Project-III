import {
  Box,
  Collapse,
  Divider,
  Drawer, FormControl,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem, Select,
  Toolbar
} from "@mui/material"
import DrawerItem from "./DrawerItem"
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {useEffect, useState} from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.webp';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import {setStore} from "../../reducers/storeSettingReducer.tsx";
import {useDispatch, useSelector} from "react-redux";

type Props = {}

export default function HomeDrawer({ }: Props) {
  const [openOrder, setOpenOrder] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for dropdown menu
  const [openDropdown, setOpenDropdown] = useState(false);
  // const openDropdown = Boolean(anchorEl); // Check if dropdown is open
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storesData = useSelector((state: any) => state.stores.stores);
  const store = useSelector((state: any) => state.storeSetting.store);


// Lấy user từ localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  // const handleClickDropdown = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };
  useEffect(() => {
    console.log("storesData từ Redux:", storesData);
  }, [storesData]);
  useEffect(() => {
    setSelectedStoreId(store?.id)
  }, [store]);
  // const handleCloseDropdown = () => {
  //   setAnchorEl(null);
  // };
  const stores = JSON.parse(localStorage.getItem("stores") || "[]");
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
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <List sx={{ p: 0, flexGrow: 1  }}>
        {isAdmin &&
            // <Collapse in={true} timeout="auto" unmountOnExit>
            //   <List disablePadding>
            //     {/* Add Dropdown menu here */}
            //     <ListItemButton onClick={handleClickDropdown}>
            //       <ListItemText primary="Chọn cửa hàng" sx={{ color: '#fff' }} />
            //       {anchorEl ? <ExpandLess style={{ color: '#fff' }} /> : <ExpandMore style={{ color: '#fff' }} />}
            //     </ListItemButton>
            //     <Menu
            //         anchorEl={anchorEl}
            //         open={openDropdown}
            //         onClose={handleCloseDropdown}
            //     >
            //       {stores.map((store: { id: number, name: string }) => (
            //           <MenuItem
            //               key={store.id}
            //               selected={store.id === selectedStoreId}
            //               onClick={() => {
            //                 setSelectedStoreId(store.id);
            //                 dispatch(setStore(storesData.find((s: any) => s.id === store.id)));
            //                 handleCloseDropdown();
            //                 navigate(`/`);
            //               }}
            //           >
            //             {store.name}
            //           </MenuItem>
            //       ))}
            //     </Menu>
            //   </List>
            // </Collapse>
            <FormControl fullWidth sx={{ mt: 1 }}>
              <Select
                  value={selectedStoreId ?? ''}
                  onChange={(e) => {
                    const storeId = Number(e.target.value);
                    setSelectedStoreId(storeId);
                    const store = storesData.find((s: any) => s.id === storeId);
                    dispatch(setStore(store));
                    navigate(`/`);
                  }}
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',  // bỏ border
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '.MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '.MuiSvgIcon-root': {
                      color: '#fff',
                    },
                    backgroundColor: '#182537',
                    // loại bỏ padding label để không chừa chỗ cho label
                    paddingLeft: 1,
                  }}
                  displayEmpty // để hiển thị placeholder khi value rỗng
                  renderValue={(selected) => {
                    const store = stores.find((s: any) => s.id === selected);
                    return store ? store.name : "Chọn cửa hàng";
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: '#182537',
                        color: '#fff',
                        maxHeight: 300,
                      },
                    },
                  }}
                  open={openDropdown}
                  onOpen={() => setOpenDropdown(true)}
                  onClose={() => setOpenDropdown(false)}
                  IconComponent={openDropdown ? ExpandLess : ExpandMore}
              >
                {/* Không cần InputLabel nữa nên xóa nó */}
                {stores.map((store: { id: number; name: string }) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.name}
                    </MenuItem>
                ))}
              </Select>
            </FormControl>
        }
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
        <Divider />
        <List>
          <DrawerItem name="Cài đặt" icon={<SettingsIcon style={{ color: '#fff' }} />} link="/store" />
        </List>
      </Box>
    </Drawer>
  )
}