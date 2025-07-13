import { FC, HTMLAttributes, CSSProperties } from "react";

type Level =
  | "body-xs"
  | "body-sm"
  | "body-md"
  | "body-lg"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  level?: Level;
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  noWrap?: boolean;
  color?: keyof typeof colorMap;
  sx?: CSSProperties;
}

const sizeMap: Record<Level, string> = {
  "body-xs": "text-xs",
  "body-sm": "text-sm",
  "body-md": "text-base",
  "body-lg": "text-lg",
  h1: "text-4xl font-bold",
  h2: "text-3xl font-bold",
  h3: "text-2xl font-bold",
  h4: "text-xl font-bold",
  h5: "text-lg font-bold",
  h6: "text-base font-bold",
};

const fontWeightMap: Record<string, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const colorMap = {
  // Original colors
  mint: "text-mint",
  lightGreen: "text-lightGreen",
  green: "text-green",
  darkGreen: "text-darkGreen",
  
  // App colors
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
  text: "text-text",
  textSecondary: "text-textSecondary",
  
  // Semantic colors
  success: "text-tertiary",
  danger: "text-secondary",
  neutral: "text-text opacity-70",
};

export const Typography: FC<TypographyProps> = ({
  level = "body-md",
  fontWeight,
  noWrap,
  className,
  sx,
  style,
  children,
  color,
  ...rest
}) => {
  const colorClass = color && colorMap[color] ? colorMap[color] : "";
  
  const classes = [
    sizeMap[level],
    fontWeight ? fontWeightMap[fontWeight] : "",
    noWrap ? "whitespace-nowrap overflow-hidden text-ellipsis" : "",
    colorClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const mergedStyle = {
    color: color && !colorMap[color] ? color : undefined,
    ...(style || {}),
    ...(sx || {} as CSSProperties),
  };

  return (
    <span className={classes} style={mergedStyle} {...rest}>
      {children}
    </span>
  );
}; 