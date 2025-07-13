import { FC, JSX, PropsWithChildren } from "react";

import { Card } from "~/ui";
import { DealModalProvider } from "~/components/controls";

type Props = PropsWithChildren<{
  map?: JSX.Element;
  connection?: JSX.Element;
  content?: JSX.Element;
}>

export const Gamegrid: FC<Props> = (props) => {
  return (
    <div className="p-6 flex flex-col h-full box-border gap-4 max-w-3xl mx-auto w-full bg-green">
      <DealModalProvider />

      {props.children}

      <Card variant="elevated" className="flex-1 min-h-[300px]">
        {props.map}
      </Card>

      <Card variant="elevated" className="p-6 min-h-[200px]">
        {props.connection}
      </Card>

      <Card variant="elevated" className="p-6 min-h-[150px]">
        {props.content}
      </Card>
    </div>
  );
};
