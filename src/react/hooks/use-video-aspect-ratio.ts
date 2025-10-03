import { useEffect, useReducer, type RefObject } from 'react'

export type AspectRatio = {
  width: number
  height: number
}

/**
 * @deprecated either use a `CallbackRef` on the video element, or require a
 * `video` as a prop. Otherwise, this code breaks any time the video unmounts
 * and remounts.
 */
export function useVideoAspectRatio(videoRef: RefObject<HTMLVideoElement | null>) {
  const [aspectRatio, setAspectRatio] = useReducer((_?: AspectRatio, aspectRatio?: AspectRatio) => {
    if (!aspectRatio) return undefined
    else return reduceRatio(aspectRatio.width, aspectRatio.height)
  }, undefined)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateAspectRatio = () => {
      if (video.videoWidth && video.videoHeight) {
        setAspectRatio({ width: video.videoWidth, height: video.videoHeight })
      } else {
        setAspectRatio(undefined)
      }
    }

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) updateAspectRatio()
    video.addEventListener('loadedmetadata', updateAspectRatio)
    return () => video.removeEventListener('loadedmetadata', updateAspectRatio)
  }, [videoRef])

  return aspectRatio
}

function reduceRatio(width: number, height: number): { width: number; height: number } {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  const divisor = gcd(width, height)
  return {
    width: width / divisor,
    height: height / divisor,
  }
}
