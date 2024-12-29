import { Outlet, Navigate } from "react-router-dom"

type Props = {}

export default function CustomerRoute({ }: Props) {

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.roles[0] === "ROLE_SUPPORT" || user.roles[0] === "ROLE_ADMIN") {
    return <Outlet />
  } else {
    return <Navigate to="/accessdenied" />
  }
}