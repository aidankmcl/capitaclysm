import { FC, HTMLAttributes, CSSProperties } from "react";

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
  spacing?: number;
  justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
  alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
  sx?: CSSProperties;
}

export const Stack: FC<StackProps> = ({
  direction = "column",
  spacing = 0,
  justifyContent,
  alignItems,
  className,
  sx,
  style,
  children,
  ...rest
}) => {
  // Convert spacing to Tailwind gap classes
  const gapClasses: Record<number, string> = {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
  };

  // Convert justifyContent to Tailwind classes
  const justifyClasses: Record<string, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  // Convert alignItems to Tailwind classes
  const alignClasses: Record<string, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };

  const classes = [
    "flex",
    direction === "row" ? "flex-row" : "flex-col",
    gapClasses[spacing] || `gap-${spacing}`,
    justifyContent ? justifyClasses[justifyContent] : "",
    alignItems ? alignClasses[alignItems] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const mergedStyle: CSSProperties = { ...(style || {}), ...(sx || {}) };

  return (
    <div className={classes} style={mergedStyle} {...rest}>
      {children}
    </div>
  );
}; 