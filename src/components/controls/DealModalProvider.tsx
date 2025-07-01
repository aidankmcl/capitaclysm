import { FC } from "react";

/**
 * NOTE:
 * The deal / trade flow has been re-implemented to use the generic
 * `useTransaction` hook. The old modal-driven "deal" UX will be rebuilt on top
 * of the new primitives, but the previous implementation relied on now-removed
 * `PropertyDeal` structures. To keep the application compiling while that new
 * UI is in flight, we temporarily render nothing here.
 */

export const DealModalProvider: FC = () => {
  // When the new deal UI is ready, hook it up here.
  return null;
}; 