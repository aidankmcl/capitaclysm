import { forwardRef, HTMLAttributes, CSSProperties } from "react";
import { BoxProps as JoyBoxProps } from "@mui/joy";

// Restrict props to native HTML div attributes plus our optional `sx` style map.
interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  sx?: JoyBoxProps["sx"];
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ className, sx, style, children, ...rest }, ref) => {
    const mergedStyle: CSSProperties = { ...(style || {}), ...(sx as CSSProperties) };

    return (
      <div ref={ref} className={className} style={mergedStyle} {...rest}>
        {children}
      </div>
    );
  }
);

Box.displayName = "Box"; 