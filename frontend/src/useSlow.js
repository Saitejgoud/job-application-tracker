import { useEffect, useState } from "react";

export default function useSlow(isLoading, delay = 4000) {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsSlow(false);
      return undefined;
    }

    const timeout = window.setTimeout(() => setIsSlow(true), delay);
    return () => window.clearTimeout(timeout);
  }, [isLoading, delay]);

  return isSlow;
}
