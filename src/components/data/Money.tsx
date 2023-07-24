import { FC } from "react";
import { Chip, Typography } from "@mui/joy";


type JoyTypographyProps = Parameters<typeof Typography>[0];
type JoyChipProps = Parameters<typeof Chip>[0];

type Color = JoyTypographyProps['color'];

type Props = {
  amount: number;
  variant?: JoyChipProps['variant'];
  size?: JoyChipProps['size'];
  start?: JSX.Element;
}

export const Money: FC<Props> = (props) => {
  const color: Color = props.amount >= 0 ? 'success' : 'danger';

  return (
    <Chip color={color} variant={props.variant || "soft"} size={props.size} sx={{ borderColor: color }}>
      <Typography level="h6" color={color}>${Math.abs(props.amount)}</Typography>
    </Chip>
  );
}
