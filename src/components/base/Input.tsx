import { FC, useId } from 'react';

import { default as JoyInput } from '@mui/joy/Input';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';

type JoyProps = Parameters<typeof JoyInput>[0];

type Props = {
  label?: string;
  value?: JoyProps['value'];
  onChange?: JoyProps['onChange'];
  placeholder?: string;
  sx?: JoyProps['sx'];
}

export const Input: FC<Props> = (props) => {
  const id = useId();

  return (
    <JoyInput
      id={id}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
      startDecorator={props.label && (<>
        <label htmlFor={id}>
          <Typography level="body4" sx={{ mr: 1 }}>{props.label}</Typography>
        </label>
        <Divider orientation="vertical" />
      </>)}
      sx={props.sx}
    />
  );
};
