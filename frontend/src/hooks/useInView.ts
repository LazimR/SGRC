import { useState, useEffect, useRef } from "react"


export default function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null!)

  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting)
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return { ref, inView }
}
