import { useEffect } from 'react';

export const useKeyboard = (handlers) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Tab key is allowed for normal navigation
      if (e.key === 'Tab') {
        return;
      }

      if (e.key === 'Escape' && handlers.onEscape) {
        e.preventDefault();
        handlers.onEscape();
      }

      if (e.key === 'Enter' && handlers.onEnter) {
        e.preventDefault();
        handlers.onEnter();
      }

      if (e.key === 'ArrowUp' && handlers.onArrowUp) {
        e.preventDefault();
        handlers.onArrowUp();
      }

      if (e.key === 'ArrowDown' && handlers.onArrowDown) {
        e.preventDefault();
        handlers.onArrowDown();
      }

      if (e.key === 'ArrowLeft' && handlers.onArrowLeft) {
        e.preventDefault();
        handlers.onArrowLeft();
      }

      if (e.key === 'ArrowRight' && handlers.onArrowRight) {
        e.preventDefault();
        handlers.onArrowRight();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers]);
};