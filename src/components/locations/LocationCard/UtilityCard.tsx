import { FC } from "react";
import { Divider, Stack, Typography } from "~/ui";

import { Money } from "~/ui";
import { Location } from "../../../data/locations";

type Props = {
  price: number;
  location: Location;
}

export const UtilityCard: FC<Props> = (props) => {
  const { price, location } = props;

  if (location.type !== "utility") return <></>;

  return (
    <Stack spacing={1} className="mx-3">
      <Stack direction="row" className="justify-center items-center mt-1" spacing={1}>
        <Typography level="body-sm">Price</Typography>
        <Money amount={price} />
      </Stack>

      <Divider />

      <Typography level="body-sm">If 1 utility is owned, rent is <b>{location.rent1Multiplier}</b> times the amount shown on the dice</Typography>
      <Typography level="body-sm">If 2 utilities are owned, rent is <b>{location.rent2Multiplier}</b> times the amount shown on the dice</Typography>
    </Stack>
  );
};
