import { Drawer, Divider, Toolbar, List } from '@mui/material'
import DrawerItem from './DrawerItem'
import HomeIcon from '@mui/icons-material/Home'
import logo from '../../assets/logo.webp'

type Props = {}

export default function AdminDrawer({}: Props) {
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
        <DrawerItem name="Cửa hàng" icon={<HomeIcon />} link="/" />
      </List>
    </Drawer>
  )
}