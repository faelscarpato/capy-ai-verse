import { useRef, useCallback, useEffect } from 'react';

interface GestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onLongPress?: () => void;
  onPullToRefresh?: () => void;
}

export const useGestures = (handlers: GestureHandlers) => {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    // Long press detection
    if (handlers.onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        if ('vibrate' in navigator) navigator.vibrate(50);
        handlers.onLongPress?.();
      }, 500);
    }
  }, [handlers]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Pull to refresh
    if (handlers.onPullToRefresh && window.scrollY === 0) {
      const touch = e.touches[0];
      const startY = touchStartRef.current?.y || 0;
      const deltaY = touch.clientY - startY;
      
      if (deltaY > 100) {
        handlers.onPullToRefresh();
      }
    }
  }, [handlers]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;

    // Swipe detection
    if (deltaTime < 300 && Math.abs(deltaX) > 50) {
      if (deltaX > 0) handlers.onSwipeRight?.();
      else handlers.onSwipeLeft?.();
    }

    if (deltaTime < 300 && Math.abs(deltaY) > 50) {
      if (deltaY > 0) handlers.onSwipeDown?.();
      else handlers.onSwipeUp?.();
    }

    touchStartRef.current = null;
  }, [handlers]);

  const attachGestures = useCallback((element: HTMLElement | null) => {
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { attachGestures };
};