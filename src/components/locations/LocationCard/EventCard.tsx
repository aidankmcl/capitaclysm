import { FC } from "react";
import { Divider, Typography } from "~/ui";

import { Location } from "~/data";

type Props = {
  price: number;
  location: Location;
}

export const EventCard: FC<Props> = (props) => {
  const { location } = props;

  if (location.type !== "event") return <></>;

  return (
    <div className="flex flex-col gap-1 mx-3">
      <Divider />
      <Typography level="body-sm">{location.description}</Typography>
    </div>
  );
};
