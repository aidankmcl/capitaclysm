import { FC } from "react";
import { Divider, Stack, Typography } from "~/ui";

import { Location } from "~/data";

type Props = {
  price: number;
  location: Location;
}

export const EventCard: FC<Props> = (props) => {
  const { location } = props;

  if (location.type !== "event") return <></>;

  return (
    <Stack spacing={1} className="mx-3">
      <Divider />
      <Typography level="body-sm">{location.description}</Typography>
    </Stack>
  );
};
