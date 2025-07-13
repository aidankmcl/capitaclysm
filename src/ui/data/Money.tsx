import { FC } from "react";
import { Chip, Typography } from "~/ui";

type Props = {
  amount: number;
  variant?: "outlined" | "solid";
  size?: "sm" | "md" | "lg";
};

export const Money: FC<Props> = (props) => {
  const isPositive = props.amount >= 0;
  const color = isPositive ? "primary" : "danger";

  return (
    <Chip 
      color={color} 
      variant={props.variant || "solid"} 
      size={props.size}
    >
      <Typography 
        level="body-md" 
        color={isPositive ? "tertiary" : "secondary"}
      >
        ${Math.abs(props.amount)}
      </Typography>
    </Chip>
  );
};
