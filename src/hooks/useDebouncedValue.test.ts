import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDebouncedValue } from './useDebouncedValue';
import { act } from 'react';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    );

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 500 });

    // Value should not update immediately
    expect(result.current).toBe('initial');

    // Fast-forward time by less than delay
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('initial');

    // Fast-forward time to complete delay
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('updated');
  });

  it('should reset timer when value changes before delay completes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    );

    // First update
    rerender({ value: 'first', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Second update before first completes
    rerender({ value: 'second', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Still should be initial
    expect(result.current).toBe('initial');

    // Complete the delay for second update
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('second');
  });

  it('should work with different data types', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: 42, delay: 500 }
      }
    );

    expect(result.current).toBe(42);

    rerender({ value: 100, delay: 500 });
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe(100);
  });

  it('should work with objects', () => {
    const initialObj = { name: 'John', age: 30 };
    const updatedObj = { name: 'Jane', age: 25 };

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: initialObj, delay: 500 }
      }
    );

    expect(result.current).toEqual(initialObj);

    rerender({ value: updatedObj, delay: 500 });
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toEqual(updatedObj);
  });

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: 'initial', delay: 0 }
      }
    );

    rerender({ value: 'updated', delay: 0 });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current).toBe('updated');
  });

  it('should handle delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    );

    // Update value and delay
    rerender({ value: 'updated', delay: 1000 });
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should not update yet (new delay is 1000ms)
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('updated');
  });

  it('should cleanup timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount } = renderHook(() => useDebouncedValue('test', 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
