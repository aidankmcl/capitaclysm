import { FC, HTMLAttributes, CSSProperties } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "outlined" | "solid" | "elevated";
  sx?: CSSProperties;
  style?: CSSProperties;
}

export const Card: FC<CardProps> = ({ variant = "solid", className, children, sx, style, ...rest }) => {
  const mergedStyle: CSSProperties = { ...(style || {}), ...(sx || {}) };
  const variantClasses = {
    outlined: "border border-tertiary bg-primary",
    solid: "bg-secondary text-textSecondary shadow-md",
    elevated: "bg-primary border border-tertiary shadow-lg",
  };

  const combined = [
    "rounded-md p-4",
    variantClasses[variant],
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={combined} style={mergedStyle} {...rest}>
      {children}
    </div>
  );
}; 