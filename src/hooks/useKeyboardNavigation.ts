import { useEffect, useCallback, useRef } from "react";

interface UseKeyboardNavigationOptions {
  onNext?: () => void;
  onPrevious?: () => void;
  onEscape?: () => void;
  onEnter?: () => void;
  onSpace?: () => void;
  customHandlers?: Record<string, () => void>;
  enabled?: boolean;
  preventInInputs?: boolean;
}

export function useKeyboardNavigation({
  onNext,
  onPrevious,
  onEscape,
  onEnter,
  onSpace,
  customHandlers = {},
  enabled = true,
  preventInInputs = true,
}: UseKeyboardNavigationOptions) {
  const handlersRef = useRef({
    onNext,
    onPrevious,
    onEscape,
    onEnter,
    onSpace,
    customHandlers,
  });

  // Update refs when handlers change
  useEffect(() => {
    handlersRef.current = {
      onNext,
      onPrevious,
      onEscape,
      onEnter,
      onSpace,
      customHandlers,
    };
  }, [onNext, onPrevious, onEscape, onEnter, onSpace, customHandlers]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const target = event.target as HTMLElement;
    
    // Skip if focused on input elements
    if (preventInInputs) {
      const isInput = target.tagName === "INPUT" || 
                     target.tagName === "TEXTAREA" || 
                     target.isContentEditable ||
                     target.closest('[role="textbox"]');
      if (isInput) return;
    }

    const { onNext, onPrevious, onEscape, onEnter, onSpace, customHandlers } = handlersRef.current;

    // Arrow navigation
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      if (onNext) {
        event.preventDefault();
        onNext();
      }
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      if (onPrevious) {
        event.preventDefault();
        onPrevious();
      }
      return;
    }

    // Escape
    if (event.key === "Escape" && onEscape) {
      event.preventDefault();
      onEscape();
      return;
    }

    // Enter
    if (event.key === "Enter" && onEnter) {
      event.preventDefault();
      onEnter();
      return;
    }

    // Space
    if (event.key === " " && onSpace) {
      event.preventDefault();
      onSpace();
      return;
    }

    // Custom handlers (e.g., 'n' for notes, 'f' for fullscreen)
    const customHandler = customHandlers[event.key] || customHandlers[event.key.toLowerCase()];
    if (customHandler) {
      event.preventDefault();
      customHandler();
    }
  }, [enabled, preventInInputs]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

// Specialized hook for slide navigation
export function useSlideNavigation({
  onNext,
  onPrevious,
  onToggleNotes,
  onToggleFullscreen,
  enabled = true,
}: {
  onNext: () => void;
  onPrevious: () => void;
  onToggleNotes?: () => void;
  onToggleFullscreen?: () => void;
  enabled?: boolean;
}) {
  useKeyboardNavigation({
    onNext,
    onPrevious,
    enabled,
    customHandlers: {
      n: onToggleNotes || (() => {}),
      N: onToggleNotes || (() => {}),
      f: onToggleFullscreen || (() => {}),
      F: onToggleFullscreen || (() => {}),
    },
  });
}
