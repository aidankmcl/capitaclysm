import { forwardRef, HTMLAttributes } from "react";

// Restrict props to native HTML div attributes plus our optional `sx` style map.
interface BoxProps extends HTMLAttributes<HTMLDivElement> {}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ className, style, children, ...rest }, ref) => {

    return (
      <div ref={ref} className={className} {...rest}>
        {children}
      </div>
    );
  }
);

Box.displayName = "Box"; 