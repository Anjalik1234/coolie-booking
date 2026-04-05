import { useMemo } from 'react';

/**
 * Detects device capability to disable heavy 3D on low-end devices.
 * Checks hardware concurrency and device memory (Chrome only).
 */
export function useDevice() {
  return useMemo(() => {
    const cores = navigator.hardwareConcurrency || 4;
    const mem   = navigator.deviceMemory || 4; // GB, Chrome only
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    const isLowEnd = cores <= 2 || mem <= 2;
    const canRender3D = !isLowEnd && !isMobile;

    return { isLowEnd, isMobile, canRender3D };
  }, []);
}