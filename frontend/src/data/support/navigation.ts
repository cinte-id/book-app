import type { NavigateFunction } from 'react-router-dom';

/**
 * Back navigation with a fallback.
 * `navigate(-1)` silently does nothing when the page was opened directly
 * (no history entry), leaving users stuck — so fall back to a safe route.
 */
export function goBack(navigate: NavigateFunction, fallback = '/support') {
  const idx = (window.history.state as { idx?: number } | null)?.idx;
  if (typeof idx === 'number' && idx > 0) {
    navigate(-1);
  } else {
    navigate(fallback, { replace: true });
  }
}
