import { FC } from "react";
import { Divider, Stack, Typography } from "@mui/joy";

import { Money } from "~/components";
import { Location } from "~/data/map";

type Props = {
  price: number;
  location: Location;
}

export const UtilityCard: FC<Props> = (props) => {
  const { price, location } = props;

  if (location.type !== "utility") return <></>;

  return (
    <Stack spacing={1} mx={3}>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mt={1}>
        <Typography level="body2">Price</Typography>
        <Money amount={price} />
      </Stack>

      <Divider />

      <Typography level="body2">If 1 utility is owned, rent is <b>{location.rent1Multiplier}</b> times the amount shown on the dice</Typography>
      <Typography level="body2">If 2 utilities are owned, rent is <b>{location.rent2Multiplier}</b> times the amount shown on the dice</Typography>
    </Stack>
  )
}
