import { useEffect } from 'react';

export function useKeyboardShortcut(key: string, callback: () => void, ctrlKey = false) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        (!ctrlKey || event.ctrlKey)
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback, ctrlKey]);
}
