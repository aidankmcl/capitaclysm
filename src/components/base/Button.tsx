import { FC, PropsWithChildren } from 'react';

import { default as JoyButton } from '@mui/joy/Button';

type JoyProps = Parameters<typeof JoyButton>[0];

type Props = PropsWithChildren<{
  disabled?: boolean;
  style?: JoyProps['variant'];
  onClick?: JoyProps['onClick'];
  sx?: JoyProps['sx'];
}>

export const Button: FC<Props> = (props) => {
  return (
    <JoyButton
      variant={props.style}
      disabled={props.disabled}
      onClick={props.onClick}
      sx={props.sx}
    >
      {props.children}
    </JoyButton>
  );
};