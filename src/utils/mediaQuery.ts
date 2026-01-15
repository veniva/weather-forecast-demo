type LegacyMediaQueryList = MediaQueryList & {
  addListener: (listener: EventListenerOrEventListenerObject) => void
  removeListener: (listener: EventListenerOrEventListenerObject) => void
}

export const subscribeMediaQuery = (mediaQueryList: MediaQueryList, onChange: () => void) => {
  if ('addEventListener' in mediaQueryList) {
    mediaQueryList.addEventListener('change', onChange)
    return () => mediaQueryList.removeEventListener('change', onChange)
  }

  if ('addListener' in mediaQueryList) {
    const legacyMediaQueryList = mediaQueryList as LegacyMediaQueryList
    legacyMediaQueryList.addListener(onChange)
    return () => legacyMediaQueryList.removeListener(onChange)
  }

  return undefined
}
