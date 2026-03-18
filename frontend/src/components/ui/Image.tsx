interface LogoImageProps {
  src: string
  alt?: string
  height?: number
  scale?: number
}

export function Image({ src, alt = "logo", height = 40, scale = 1 }: LogoImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className="object-contain w-auto"
      style={{
        height: `${height}px`,
        transform: `scale(${scale})`,
        transformOrigin: "left center",
      }}
    />
  )
}
