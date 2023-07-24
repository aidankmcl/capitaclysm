import { FC, PropsWithChildren } from 'react';

import { default as JoyButton } from '@mui/joy/Button';

type JoyProps = Parameters<typeof JoyButton>[0];

type Props = PropsWithChildren<{
  disabled?: boolean;
  color?: JoyProps['color'];
  variant?: JoyProps['variant'];
  onClick?: JoyProps['onClick'];
  size?: JoyProps['size'];
  sx?: JoyProps['sx'];
}>

export const Button: FC<Props> = (props) => {
  return (
    <JoyButton
      color={props.color}
      variant={props.variant}
      disabled={props.disabled}
      onClick={props.onClick}
      size={props.size}
      sx={props.sx}
    >
      {props.children}
    </JoyButton>
  );
};
