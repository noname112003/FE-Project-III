import { ListItem, ListItemButton, ListItemText, ListItemIcon } from "@mui/material"
import { useNavigate } from "react-router-dom"

type Props = {
  name: string,
  link: string,
  icon: any
}

export default function DrawerItem({ name, link, icon }: Props) {

  const navigate = useNavigate();

  return (
    <ListItem key={name} disablePadding>
      <ListItemButton onClick={() => navigate(link)}>
        <ListItemIcon sx={{ color: "#fff" }}>
          {icon}
        </ListItemIcon>
        <ListItemText sx={{ color: '#fff' }} primary={name} />
      </ListItemButton>
    </ListItem>
  )
}