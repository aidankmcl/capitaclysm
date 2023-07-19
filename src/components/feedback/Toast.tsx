
import Box from "@mui/joy/Box";

import { Toaster, toast as sonnerToast } from "sonner";
import { Alert, IconButton } from "@mui/joy";

type ToasterProps = Parameters<typeof Toaster>[0]
export const ToastProvider = (props: ToasterProps) => {
  return <Toaster position='top-right' duration={5000} {...props} />
}


export const toast = (jsx: JSX.Element) => {
  return sonnerToast.custom(t => (
    <Alert
      variant="solid"
      color="neutral"
      sx={{ width: "var(--width)", gap: 2, boxShadow: "md" }}
      endDecorator={
        <IconButton
          variant="soft"
          color="warning"
          onClick={() => sonnerToast.dismiss(t)}
        >
          X
        </IconButton>
      }
    >
      <Box sx={{ flexGrow: 1 }}>
        Joy UI feat. Sonner is awesome!
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          {jsx}
        </Box>
      </Box>
    </Alert>
  ))
}
