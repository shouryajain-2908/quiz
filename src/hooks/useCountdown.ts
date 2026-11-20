import { useEffect, useState } from 'react';

export function useCountdown(active: boolean, seconds: number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (!active) return;
    setRemaining(seconds);
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [active, seconds]);

  useEffect(() => {
    if (active && remaining === 0) onExpire();
  }, [active, remaining, onExpire]);

  return remaining;
}
