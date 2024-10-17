import { useCallback, useEffect, useRef } from 'react';

// From https://layonez.medium.com/performant-animations-with-requestanimationframe-and-react-hooks-99a32c5c9fbf

type HookProps = {
  nextAnimationFrameHandler: (percentComplete: number) => void,
  duration?: number,
  shouldAnimate?: boolean
}

export const useAnimationFrame = ({
	nextAnimationFrameHandler,
	// we still want to have "infinite" animations in some cases
	duration = Number.POSITIVE_INFINITY,
	shouldAnimate = true
}: HookProps) => {
	const frame = useRef(0);
	// keep track of when animation is started
	const firstFrameTime = useRef(performance.now());


	const animate = useCallback((now: number) => {
		// calculate at what time fraction we are currently of whole time of animation
		let timeFraction = (now - firstFrameTime.current) / duration;
		if (timeFraction > 1) {
			timeFraction = 1;
		}

		if (timeFraction <= 1) {
			nextAnimationFrameHandler(timeFraction);

			// request next frame only in cases when we not reached 100% of duration
			if (timeFraction != 1) frame.current = requestAnimationFrame(animate);
		}
	}, [nextAnimationFrameHandler]);

	useEffect(() => {
    if (frame.current) {
      cancelAnimationFrame(frame.current);
    }

    if (shouldAnimate) {
			firstFrameTime.current = performance.now();
			frame.current = requestAnimationFrame(animate);
    }

		return () => cancelAnimationFrame(frame.current);
	}, [animate, shouldAnimate]);
};
