import { FC, PropsWithChildren, useState } from 'react';

import JoyModal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import { ModalOverflow } from '@mui/joy';


type JoyModalProps = Parameters<typeof JoyModal>[0];
type JoyModalDialogProps = Parameters<typeof ModalDialog>[0];

type Props = PropsWithChildren & {
  orientation?: JoyModalDialogProps['aria-orientation'];
  sx?: JoyModalProps['sx'];
  forceAnswer?: boolean;
  onClose?: () => void
}

export const Modal: FC<Props> = (props) => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <JoyModal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={() => {
        if (props.forceAnswer) return;
        if (props.onClose) props.onClose();
        setOpen(false);
      }}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <ModalOverflow>
        <ModalDialog
          aria-orientation={props.orientation}
          variant="outlined"
          sx={{
            maxWidth: '100%',
            borderRadius: 'md',
            boxShadow: 'lg',
            margin: 2,
            ...props.sx
          }}
        >
          {!props.forceAnswer && (
            <ModalClose
              variant="outlined"
              sx={{
                top: 'calc(-1/4 * var(--IconButton-size))',
                right: 'calc(-1/4 * var(--IconButton-size))',
                boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
                borderRadius: '50%',
                bgcolor: 'background.body',
              }}
            />
          )}
          {props.children}
        </ModalDialog>
      </ModalOverflow>
    </JoyModal>
  );
}
