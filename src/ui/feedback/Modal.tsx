import { FC, PropsWithChildren, useState } from "react";
import {
  Modal as JoyModal,
  ModalDialog,
  ModalOverflow,
  ModalClose,
  ModalDialogProps as JoyModalDialogProps
} from "@mui/joy";

type Props = PropsWithChildren & {
  orientation?: JoyModalDialogProps["aria-orientation"];
  forceAnswer?: boolean;
  onClose?: () => void;
  className?: string;
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
      className="flex justify-center items-center"
    >
      <ModalOverflow>
        <ModalDialog
          aria-orientation={props.orientation}
          variant="outlined"
          className={`max-w-full rounded-md shadow-lg m-2 bg-mint border-lightGreen ${props.className}`}
        >
          {!props.forceAnswer && (
            <ModalClose
              variant="outlined"
              className="rounded-full shadow-md bg-mint border-lightGreen text-darkGreen hover:bg-lightGreen hover:text-mint -top-2 -right-2"
            />
          )}
          {props.children}
        </ModalDialog>
      </ModalOverflow>
    </JoyModal>
  );
};
