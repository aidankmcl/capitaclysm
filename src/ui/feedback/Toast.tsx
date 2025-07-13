import { FC, PropsWithChildren } from "react";
import { Alert, IconButton } from "@mui/joy";

import { Toaster, toast as sonnerToast } from "sonner";
import { JSX } from "react";

type ToasterProps = Parameters<typeof Toaster>[0]

export const ToastProvider: FC<PropsWithChildren<ToasterProps>> = (props) => <Toaster {...props} />;

export const toast = (jsx: JSX.Element) => {
  return sonnerToast.custom(t => (
    <Alert
      variant="solid"
      color="neutral"
      className="w-full gap-2 shadow-md bg-mint border-lightGreen text-darkGreen"
      endDecorator={
        <IconButton
          variant="soft"
          color="warning"
          onClick={() => sonnerToast.dismiss(t)}
          className="bg-lightGreen text-darkGreen hover:bg-green hover:text-mint"
        >
          X
        </IconButton>
      }
    >
      <div className="flex-grow">
        Joy UI feat. Sonner is awesome!
        <div className="flex items-center mt-1">
          {jsx}
        </div>
      </div>
    </Alert>
  ));
};
