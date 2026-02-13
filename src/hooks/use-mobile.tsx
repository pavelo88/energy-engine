import * as React from "react"

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const

export function useIsMobile(breakpoint: keyof typeof BREAKPOINTS = "md") {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const bp = BREAKPOINTS[breakpoint]

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${bp - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < bp)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < bp)
    return () => mql.removeEventListener("change", onChange)
  }, [bp])

  return !!isMobile
}
