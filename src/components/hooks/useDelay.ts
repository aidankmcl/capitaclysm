
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

type ReturnType = [boolean, Dispatch<SetStateAction<boolean>>];

export const useDelay = (duration: number, delay: number = 200): ReturnType => {
  const [internalStatus, setInternalStatus] = useState(false);
  const [userStatus, setUserStatus] = useState(false);

  const delayTimerRef = useRef(0);
  const durationTimerRef = useRef(0);

  useEffect(() => {
    if (!userStatus) return;

    window.clearTimeout(delayTimerRef.current);
    delayTimerRef.current = window.setTimeout(() => {
      setInternalStatus(true);
    }, delay);
  }, [userStatus]);

  useEffect(() => {
    if (!internalStatus) return;

    window.clearTimeout(durationTimerRef.current);
    durationTimerRef.current = window.setTimeout(() => {
      setInternalStatus(false);
      setUserStatus(false);
    }, duration);
  }, [internalStatus])

  return [internalStatus, setUserStatus];
};
