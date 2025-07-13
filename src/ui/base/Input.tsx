import { FC, useId, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  slotProps?: {
    input?: React.InputHTMLAttributes<HTMLInputElement>;
  };
}

export const Input: FC<Props> = ({ label, className, slotProps, style, ...rest }) => {
  const id = useId();

  return (
    <div className="flex items-center gap-2">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-darkGreen">
          {label}
        </label>
      )}
      <input
        id={id}
        className={[
          "border border-lightGreen rounded px-2 py-1 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent",
          "bg-mint text-darkGreen placeholder-green",
          "transition-colors",
          className
        ].filter(Boolean).join(" ")}
        style={style}
        {...(slotProps?.input || {})}
        {...rest}
      />
    </div>
  );
};
