import React from 'react';

function useInterval (callback, delay) {
  const callbackSave = React.useRef();
  React.useEffect(() => {
    callbackSave.current = callback;
  }, [callback]);

  React.useEffect(() => {
    function tick () {
      callbackSave.current();
    }
    if (delay != null) {
      const intervalId = setInterval(tick, delay);
      return () => clearInterval(intervalId);
    }
  }, [callback, delay]);
}

export default useInterval;
