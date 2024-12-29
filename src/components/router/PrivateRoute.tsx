import { Outlet, Navigate } from "react-router-dom"

type Props = {}

export default function PrivateRoute({ }: Props) {

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.roles) {
    return <Outlet />
  } else {
    return <Navigate to="/login" />
  }
}