import { FC, PropsWithChildren } from "react";

import { Toaster, toast as sonnerToast } from "sonner";
import { JSX } from "react";

type ToasterProps = Parameters<typeof Toaster>[0]

export const ToastProvider: FC<PropsWithChildren<ToasterProps>> = (props) => <Toaster {...props} />;

export const toast = (jsx: JSX.Element) => {
  return sonnerToast.custom(t => (
    <div className="w-full flex items-center gap-2 shadow-md bg-mint border border-lightGreen text-darkGreen p-3 rounded-md">
      <div className="flex-grow">
        Joy UI feat. Sonner is awesome!
        <div className="flex items-center mt-1">
          {jsx}
        </div>
      </div>
      <button
        onClick={() => sonnerToast.dismiss(t)}
        className="bg-lightGreen text-darkGreen hover:bg-green hover:text-mint transition-colors duration-200 px-3 py-1 rounded-md font-medium"
        aria-label="Dismiss notification"
      >
        X
      </button>
    </div>
  ));
};
