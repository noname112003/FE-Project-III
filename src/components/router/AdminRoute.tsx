import { Navigate, Outlet } from "react-router-dom"

type Props = {}

export default function AdminRoute({ }: Props) {

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.roles[0] === "ROLE_ADMIN") {
    return <Outlet />
  } else {
    return <Navigate to="/accessdenied" />
  }

}