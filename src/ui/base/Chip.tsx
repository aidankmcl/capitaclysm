import { FC, HTMLAttributes, ReactNode } from "react";

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "outlined" | "solid";
  color?: "neutral" | "primary" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  startDecorator?: ReactNode;
}

export const Chip: FC<ChipProps> = ({
  variant = "solid",
  color = "neutral",
  size = "md",
  startDecorator,
  className,
  children,
  ...rest
}) => {
  const sizeClasses: Record<string, string> = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const colorClasses: Record<string, Record<string, string>> = {
    neutral: {
      solid: "bg-tertiary text-text",
      outlined: "border border-tertiary text-tertiary bg-transparent",
    },
    primary: {
      solid: "bg-primary text-secondary",
      outlined: "border border-primary text-primary bg-transparent",
    },
    success: {
      solid: "bg-tertiary text-text",
      outlined: "border border-tertiary text-tertiary bg-transparent",
    },
    danger: {
      solid: "bg-secondary text-textSecondary",
      outlined: "border border-secondary text-secondary bg-transparent",
    },
  };

  const combined = [
    "inline-flex items-center rounded-full",
    sizeClasses[size],
    colorClasses[color][variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={combined} {...rest}>
      {startDecorator && <span className="mr-1 flex-shrink-0">{startDecorator}</span>}
      {children}
    </span>
  );
}; 