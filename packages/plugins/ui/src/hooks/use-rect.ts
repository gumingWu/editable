import { useEffect, useState } from 'react'
import { Measurable, observeElementRect } from '../observeElementRect'

/**
 * Use this custom hook to get access to an element's rect (getBoundingClientRect)
 * and observe it along time.
 */
function useRect(measurable: Measurable | null) {
  const [rect, setRect] = useState<ClientRect>()
  useEffect(() => {
    if (measurable) {
      const unobserve = observeElementRect(measurable, setRect)
      return () => {
        setRect(undefined)
        unobserve()
      }
    }
    return
  }, [measurable])
  return rect
}

export { useRect }
