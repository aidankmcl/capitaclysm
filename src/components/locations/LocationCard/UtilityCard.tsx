import { FC } from "react";
import { Divider, Typography } from "~/ui";

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
    <div className="flex flex-col gap-1 mx-3">
      <div className="flex flex-row gap-1 justify-center items-center mt-1">
        <Typography level="body-sm">Price</Typography>
        <Money amount={price} />
      </div>

      <Divider />

      <Typography level="body-sm">If 1 utility is owned, rent is <b>{location.rent1Multiplier}</b> times the amount shown on the dice</Typography>
      <Typography level="body-sm">If 2 utilities are owned, rent is <b>{location.rent2Multiplier}</b> times the amount shown on the dice</Typography>
    </div>
  );
};
