/** @source https://usehooks-ts.com/react-hook/use-interval */

import { useEffect } from 'react';

const useInterval = (callback: () => void, delay: number | null) => {
  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return;
    }

    const id = setInterval(callback, delay);

    return () => clearInterval(id);
  }, [delay, callback]);
};

export default useInterval;
