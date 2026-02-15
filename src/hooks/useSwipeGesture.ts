import { useState, useRef, useCallback, useEffect } from 'react';

interface UseSwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onDrag?: (deltaX: number) => void;
  onDragEnd?: () => void;
  threshold?: number; // Minimum distance in pixels to trigger a swipe
  maxDuration?: number; // Maximum duration in ms for a swipe gesture
}

interface SwipeState {
  isSwiping: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export function useSwipeGesture(options: UseSwipeGestureOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onDrag,
    onDragEnd,
    threshold = 50,
    maxDuration = 300
  } = options;

  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwiping: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0
  });

  const startTimeRef = useRef<number>(0);
  const elementRef = useRef<HTMLElement | null>(null);
  const swipeStateRef = useRef<SwipeState>(swipeState);

  // Keep ref in sync with state
  useEffect(() => {
    swipeStateRef.current = swipeState;
  }, [swipeState]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];

    // Don't prevent default in touchstart - let the browser track the gesture
    // We'll prevent it in touchmove once we determine the direction

    setSwipeState({
      isSwiping: true,
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY
    });
    startTimeRef.current = Date.now();
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const state = swipeStateRef.current;
      if (!state.isSwiping) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - state.startX;
      const deltaY = touch.clientY - state.startY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Prevent browser gestures as soon as we detect movement direction
      // This needs to happen EARLY before browser commits to navigation
      if (absDeltaX > 5 || absDeltaY > 5) {
        // Once we know the direction, prevent browser handling
        if (absDeltaX > absDeltaY) {
          // Horizontal movement - always prevent to stop back/forward navigation
          e.preventDefault();
          e.stopPropagation();
        } else if (absDeltaY > absDeltaX) {
          // Vertical movement - only prevent pull-to-refresh at page edges
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight;
          const clientHeight = document.documentElement.clientHeight;

          // Prevent pull-to-refresh at top and bounce at bottom
          if (
            (scrollTop === 0 && deltaY > 0) ||
            (scrollTop + clientHeight >= scrollHeight && deltaY < 0)
          ) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
      }

      setSwipeState((prev: SwipeState) => ({
        ...prev,
        currentX: touch.clientX,
        currentY: touch.clientY
      }));

      // Call onDrag callback if provided
      if (onDrag) {
        onDrag(deltaX);
      }
    },
    [onDrag]
  );

  const handleTouchEnd = useCallback(
    (_e: TouchEvent) => {
      const state = swipeStateRef.current;
      if (!state.isSwiping) return;

      const endTime = Date.now();
      const duration = endTime - startTimeRef.current;

      if (duration > maxDuration) {
        setSwipeState((prev: SwipeState) => ({ ...prev, isSwiping: false }));
        if (onDragEnd) onDragEnd();
        return;
      }

      const deltaX = state.currentX - state.startX;
      const deltaY = state.currentY - state.startY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Determine if it's a horizontal or vertical swipe
      if (absDeltaX > absDeltaY && absDeltaX > threshold) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }

      setSwipeState((prev: SwipeState) => ({ ...prev, isSwiping: false }));
      if (onDragEnd) onDragEnd();
    },
    [
      threshold,
      maxDuration,
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      onDragEnd
    ]
  );

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (elementRef.current) {
        elementRef.current.removeEventListener('touchstart', handleTouchStart);
        elementRef.current.removeEventListener('touchmove', handleTouchMove);
        elementRef.current.removeEventListener('touchend', handleTouchEnd);
      }

      elementRef.current = node;

      if (elementRef.current) {
        // Use { passive: false } to allow preventDefault() to work
        elementRef.current.addEventListener('touchstart', handleTouchStart, {
          passive: false
        });
        elementRef.current.addEventListener('touchmove', handleTouchMove, {
          passive: false
        });
        elementRef.current.addEventListener('touchend', handleTouchEnd, {
          passive: false
        });
      }
    },
    [handleTouchStart, handleTouchMove, handleTouchEnd]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (elementRef.current) {
        const currentElement = elementRef.current;
        currentElement.removeEventListener('touchstart', handleTouchStart);
        currentElement.removeEventListener('touchmove', handleTouchMove);
        currentElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    ref,
    swipeState,
    isSwiping: swipeState.isSwiping,
    deltaX: swipeState.currentX - swipeState.startX,
    deltaY: swipeState.currentY - swipeState.startY
  };
}

// Hook specifically for mobile navigation gestures
export function useMobileNavigationGestures(
  onBack?: () => void,
  onForward?: () => void
) {
  const { ref } = useSwipeGesture({
    onSwipeRight: onBack, // Swipe right to go back (like iOS)
    onSwipeLeft: onForward, // Swipe left to go forward
    threshold: 80, // Higher threshold for navigation to prevent accidental triggers
    maxDuration: 400
  });

  return { ref };
}
