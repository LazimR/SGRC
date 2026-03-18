import { Routes, Route } from "react-router-dom"
import PublicRoutes from "./PublicRoutes"
import PrivateRoute from "./PrivateRouter"

import AppLayout from "./layout/AppLayout"
import FullWidthLayout from "./layout/FullWidthLayout"
import RegisterUser from "../components/pages/auth/Register"
import LoginUser from "../components/pages/auth/Login"
import Profile from "../components/pages/user/Profile"
import PageNotFound from "../components/pages/errors/PageNotFound"
import ClientRoutes from "./ClientRoutes"
import SeatManagement from "../components/pages/seat/SeatManagement"
import Home from "../components/pages/home/Home"

export default function AppRoutes() {
  return (
    <Routes>

      <Route element={<PublicRoutes />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/seats" element={<SeatManagement />} />
        </Route>
      </Route>

      {/* Públicas */}
      <Route element={<PublicRoutes />}>
        <Route element={<FullWidthLayout />}>
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/login" element={<LoginUser />} />
          
        </Route>
      </Route>


      {/* Privadas com layout principal */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/client/*" element={<ClientRoutes />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />

    </Routes>
  )
}
