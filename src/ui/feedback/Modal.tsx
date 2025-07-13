import { FC, PropsWithChildren, useState, useEffect } from "react";

type Props = PropsWithChildren & {
  orientation?: "horizontal" | "vertical";
  forceAnswer?: boolean;
  onClose?: () => void;
  className?: string;
}

export const Modal: FC<Props> = (props) => {
  const [open, setOpen] = useState<boolean>(true);

  const handleClose = () => {
    if (props.forceAnswer) return;
    if (props.onClose) props.onClose();
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && !props.forceAnswer) {
      handleClose();
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
      onClick={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative max-h-full overflow-y-auto p-4 w-full max-w-2xl">
        <div
          className={`
            max-w-full rounded-md shadow-lg m-2 bg-mint border border-lightGreen
            ${props.orientation === "horizontal" ? "flex flex-row" : "flex flex-col"}
            ${props.className || ""}
          `}
          onClick={(e) => e.stopPropagation()}
          role="document"
        >
          {!props.forceAnswer && (
            <button
              onClick={handleClose}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full shadow-md bg-mint border border-lightGreen text-darkGreen hover:bg-lightGreen hover:text-mint transition-colors duration-200 flex items-center justify-center z-10"
              aria-label="Close modal"
            >
              ×
            </button>
          )}
          {props.children}
        </div>
      </div>
    </div>
  );
};
