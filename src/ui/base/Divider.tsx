import { FC, HTMLAttributes } from "react";

interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
  mx?: number;
  my?: number;
}

export const Divider: FC<DividerProps> = ({
  orientation = "horizontal",
  mx,
  my,
  className,
  ...rest
}) => {
  // Convert margin props to Tailwind classes
  const marginClasses = [
    mx !== undefined ? `mx-${mx}` : "",
    my !== undefined ? `my-${my}` : "",
  ].filter(Boolean).join(" ");

  if (orientation === "vertical") {
    return (
      <div 
        className={[
          "w-px bg-lightGreen",
          marginClasses,
          className
        ].filter(Boolean).join(" ")} 
        {...rest} 
      />
    );
  }
  
  return (
    <hr 
      className={[
        "border-t border-lightGreen",
        marginClasses,
        className
      ].filter(Boolean).join(" ")} 
      {...rest} 
    />
  );
}; 