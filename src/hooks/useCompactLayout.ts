import { useEffect, useState } from "react"
import { subscribeMediaQuery } from "../utils/mediaQuery"
import { MOBILE_VIEW_TRESHOLD } from "../constants"

export const useCompactLayout = () => {
  const [isCompact, setIsCompact] = useState(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) {
      return false
    }
    return window.matchMedia(MOBILE_VIEW_TRESHOLD).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) {
      return
    }

    const mediaQueryList = window.matchMedia(MOBILE_VIEW_TRESHOLD)
    const update = () => setIsCompact(mediaQueryList.matches)
    update()

    return subscribeMediaQuery(mediaQueryList, update)
  }, [])

  return isCompact
}