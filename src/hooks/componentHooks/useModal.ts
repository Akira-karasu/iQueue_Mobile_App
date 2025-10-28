import { useCallback, useState } from "react";

export default function useModal(initialVisible = false) {
  const [visible, setVisible] = useState(initialVisible);

  // Opens the modal
  const open = useCallback(() => setVisible(true), []);

  // Closes the modal
  const close = useCallback(() => setVisible(false), []);

  // Toggles visibility (open <-> close)
  const toggle = useCallback(() => setVisible((prev) => !prev), []);

  // Resets modal state (useful if it holds data)
  const reset = useCallback(() => setVisible(initialVisible), [initialVisible]);

  return {
    visible,
    open,
    close,
    toggle,
    reset,
    setVisible,
  };
}
