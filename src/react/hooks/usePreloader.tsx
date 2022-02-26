import { useEffect, useRef, useState } from "react";

/**
 * Preloads and resizes an image.
 *
 * **Use case:** animations and filtering on extremely large images.
 * Instead, load the full image and then resize it to the minimum possible size.
 * Animation and filtering will be applied to the resized image instead of the raw fullsize original.
 *
 * Use with the {@link PreloadedImage} component, or as a standalone.
 *
 * @returns the image element, canvas element, and imageData
 */
export function preload(
  url: string,
  width?: number,
  height?: number
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const image = document.createElement("img");
    image.crossOrigin = "anonymous";
    const canvas = document.createElement("canvas");
    image.src = url;
    image.onerror = reject;
    image.onload = () => {
      canvas.width = width ?? image.width;
      canvas.height = height ?? image.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Failed to get canvas context");
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      console.log(`Preloaded ${url} (${image.width}x${image.height})`);
      resolve(imageData);
    };
  });
}

export enum PreloadStatus {
  LOADING,
  LOADED,
  ERROR,
}

export type UsePreloadHook = {
  /** A `useState()`  mapping from image URL to loading status (started, finished, error, or undefined) */
  status: { [key: string]: PreloadStatus };

  /** A `useState()` mapping from image URL to ImageData (or undefined if not yet unloaded) */
  imageData: { [key: string]: ImageData };

  /** Preloads an image, optionally resizes it, stores status and loaded ImageData in state variables */
  preload: (
    url: string,
    width?: number,
    height?: number
  ) => Promise<ImageData | undefined>;

  /**
   * `true` when all preload calls made with this hook have completed (either in error or success).
   * This may update multiple times in the case of multiple (potentially asynchronous) preload calls.
   */
  done: boolean;
};

/**
 * Wraps image preloading functionality in a React hook,
 * handling state for loading status, errors, and final image data.
 */
export default function usePreloader(): UsePreloadHook {
  const [imageData, setImageData] = useState<UsePreloadHook["imageData"]>({});
  const [status, setStatus] = useState<UsePreloadHook["status"]>({});
  const done = Object.values(status).every(
    (status) => status === PreloadStatus.LOADED
  );
  const _preload = async (url: string, width?: number, height?: number) => {
    if ([PreloadStatus.LOADING, PreloadStatus.LOADED].includes(status[url]))
      return;
    setStatus((prev) => ({ ...prev, [url]: PreloadStatus.LOADING }));
    try {
      const imageData = await preload(url, width, height);
      setImageData((prev) => ({ ...prev, [url]: imageData }));
      return imageData;
    } catch (e) {
      console.error(e);
      setStatus((prev) => ({ ...prev, [url]: PreloadStatus.ERROR }));
      return undefined;
    }
  };
  return { preload: _preload, imageData, status, done } as UsePreloadHook;
}

export type PreloadedImageProps = {
  imageData?: ImageData;
  [key: string]: any;
};

/**
 * A simple outlet for rendering ImageData
 * (intended to be used with {@link usePreload})
 */
export function PreloadedImage({ imageData, ...props }: PreloadedImageProps) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current || !imageData) return;
    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.putImageData(imageData, 0, 0);
  }, [imageData]);
  return (
    <canvas
      ref={canvas}
      width={imageData?.width}
      height={imageData?.height}
      {...props}
    />
  );
}
