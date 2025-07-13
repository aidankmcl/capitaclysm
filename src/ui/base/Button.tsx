import { FC, PropsWithChildren, ButtonHTMLAttributes, CSSProperties } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outlined" | "soft";
  size?: "sm" | "md" | "lg";
  color?: "primary" | "neutral" | "success" | "danger";
  fullWidth?: boolean;
  sx?: CSSProperties;
}

export const Button: FC<PropsWithChildren<Props>> = ({
  variant = "solid",
  size = "md",
  color = "primary",
  className,
  fullWidth = false,
  sx,
  children,
  ...rest
}) => {
  const sizeClasses: Record<string, string> = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const colorClasses: Record<string, Record<string, string>> = {
    primary: {
      solid: "bg-primary text-secondary hover:bg-tertiary hover:text-textSecondary",
      soft: "bg-primary/20 text-primary hover:bg-primary/40",
      outlined: "border border-primary text-primary bg-transparent hover:bg-primary hover:text-secondary",
    },
    neutral: {
      solid: "bg-secondary text-textSecondary hover:bg-tertiary hover:text-secondary",
      soft: "bg-secondary/20 text-secondary hover:bg-secondary/40",
      outlined: "border border-secondary text-secondary bg-transparent hover:bg-secondary hover:text-textSecondary",
    },
    success: {
      solid: "bg-tertiary text-text hover:bg-primary hover:text-secondary",
      soft: "bg-tertiary/20 text-tertiary hover:bg-tertiary/40",
      outlined: "border border-tertiary text-tertiary bg-transparent hover:bg-tertiary hover:text-text",
    },
    danger: {
      solid: "bg-secondary text-textSecondary hover:bg-tertiary hover:text-secondary",
      soft: "bg-secondary/20 text-secondary hover:bg-secondary/40",
      outlined: "border border-secondary text-secondary bg-transparent hover:bg-secondary hover:text-textSecondary",
    },
  };

  const combined = [
    "rounded font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
    sizeClasses[size],
    colorClasses[color][variant],
    fullWidth ? "w-full" : "",
    className,
  ].filter(Boolean).join(" ");

  const mergedStyle: CSSProperties = { ...((rest.style as CSSProperties) || {}), ...(sx || {}) };

  return (
    <button className={combined} style={mergedStyle} {...rest}>
      {children}
    </button>
  );
};
