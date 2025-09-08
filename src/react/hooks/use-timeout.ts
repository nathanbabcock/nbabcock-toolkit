/** @source https://usehooks-ts.com/react-hook/use-timeout */

import { useEffect } from 'react';

const useTimeout = (callback: () => void, delay: number | null) => {
  // Set up the timeout.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return;
    }

    const id = setTimeout(callback, delay);

    return () => clearTimeout(id);
  }, [delay, callback]);
};

export default useTimeout;
