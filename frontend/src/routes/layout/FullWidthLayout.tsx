import { Outlet } from "react-router-dom"
import Footer from "../../components/layout/Footer"
import FlashMessage from "../../components/ui/Message"

export default function FullWidthLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <FlashMessage />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
