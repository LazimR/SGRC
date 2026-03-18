import useInView from "../../hooks/useInView"

interface AnimatedSectionProps {
  Component: React.ComponentType<{
    sectionRef: React.RefObject<HTMLElement>
    inView: boolean
  }>
}

export function AnimatedSection({ Component }: AnimatedSectionProps) {
  const { ref, inView } = useInView<HTMLElement>()

  return <Component sectionRef={ref} inView={inView} />
}
