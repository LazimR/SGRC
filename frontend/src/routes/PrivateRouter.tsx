import { Outlet } from "react-router-dom"
import { useUser } from "../context/useUser"
import ExpiredSession from "../components/pages/auth/ExpiredSession"



function PrivateRoute() {
  const { authenticated, loading } = useUser()

  if (loading) {
    return <p>Carregando sessão...</p>
  }

  if (!authenticated) {
    return <ExpiredSession />
  }

  return <Outlet />
}

export default PrivateRoute
