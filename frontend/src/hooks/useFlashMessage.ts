import { useCallback } from "react"
import bus from "../utils/bus"


export default function useFlashMessage() {
  const setFlashMessage = useCallback(
    (
      type: "success" | "error" | "warning",
      message?: string
    ) => {
      bus.emit("flash", { type, message })
    },
    []
  )

  return { setFlashMessage }
}
