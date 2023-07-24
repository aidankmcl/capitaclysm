import { EffectCallback, useEffect, useRef } from 'react';

export const useOnce = (func: EffectCallback, deps?: unknown[]) => {
  const initRef = useRef(false);
  const cleanupRef = useRef<ReturnType<EffectCallback>>(() => undefined);

  useEffect(() => {
    if (!initRef.current && func && (!deps || deps.every((d) => typeof d !== 'undefined'))) {
      initRef.current = true;
      cleanupRef.current = func();
    }

    return cleanupRef.current;
  }, [initRef, func, deps]);
};
