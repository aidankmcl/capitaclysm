import { FC, PropsWithChildren } from "react";

import { Navbar } from "../../navigation";

import { ToastProvider } from "~/ui";

export const Layout: FC<PropsWithChildren> = (props) => {
  return (
    <div className="w-screen h-screen max-w-full max-h-full">
      <ToastProvider />

      <div className="fixed right-7 bottom-0 z-10">
        <Navbar />
      </div>
      
      <div className="w-full h-full after:clear-both after:content-[''] after:table">
        {props.children}
      </div>
    </div>
  );
};
