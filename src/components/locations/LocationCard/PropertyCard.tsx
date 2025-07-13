import { FC } from "react";
import { Divider, Stack, Typography } from "~/ui";

import { Money } from "~/ui";
import { Location } from "../../../data/locations";

type Props = {
  price: number;
  location: Location;
}

export const PropertyCard: FC<Props> = (props) => {
  const { price, location } = props;

  if (location.type !== "property") return <></>;

  return (
    <Stack spacing={0} className="mx-3">
      <Stack direction="row" className="justify-center items-center mt-1" spacing={1}>
        <Typography level="body-sm">Price</Typography>
        <Money amount={price} />
      </Stack>

      <Divider className="my-1" />

      <Stack direction="row" className="justify-center items-center" spacing={1}>
        <Typography level="body-sm">Base rent</Typography>
        <Money variant="outlined" amount={location.baseRent} />
      </Stack>
      {[location.rent1, location.rent2, location.rent3, location.rent4].map((rent, i) => (
        <Stack key={i} direction="row" className="justify-between items-center" spacing={1}>
          <Typography level="body-sm">{i + 1} house{i > 0 ? "s" : ""}</Typography>
          <Money variant="outlined" amount={rent} />
        </Stack>
      ))}
      <Stack direction="row" className="justify-between items-center" spacing={1}>
        <Typography level="body-sm">With hotel</Typography>
        <Money variant="outlined" amount={location.rent5} />
      </Stack>
    </Stack>
  );
};
