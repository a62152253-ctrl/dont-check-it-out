import { useEffect } from "react";

interface UseAutoLockProps {
  autoLockMinutes: number;
  unlocked: boolean;
  onLock: () => void;
}

export function useAutoLock({ autoLockMinutes, unlocked, onLock }: UseAutoLockProps) {
  useEffect(() => {
    if (!unlocked || autoLockMinutes === 0) return;

    let timerId: number;

    const handleActivity = () => {
      window.clearTimeout(timerId);
      timerId = window.setTimeout(() => {
        onLock();
      }, autoLockMinutes * 60 * 1000);
    };

    handleActivity(); // initialize

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    events.forEach(evt => window.addEventListener(evt, handleActivity));

    return () => {
      window.clearTimeout(timerId);
      events.forEach(evt => window.removeEventListener(evt, handleActivity));
    };
  }, [autoLockMinutes, unlocked, onLock]);
}
