import { useEffect, useRef, useState, type RefObject } from 'react'

type UseInViewOptions = {
  rootMargin?: string
  threshold?: number
}

export const useInView = <T extends Element>(options: UseInViewOptions = {}): [RefObject<T | null>, boolean] => {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  const { rootMargin = '0px', threshold = 0 } = options

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return [ref, inView]
}
