import { FC } from "react";
import { Divider, Stack, Typography } from "@mui/joy";

import { Location } from "~/data/map";

type Props = {
  price: number;
  location: Location;
}

export const EventCard: FC<Props> = (props) => {
  const { location } = props;

  if (location.type !== "event") return <></>;

  return (
    <Stack spacing={1} mx={3}>
      <Divider />
      <Typography level="body2">{location.description}</Typography>
    </Stack>
  )
}
