import { FC } from "react";
import { Divider, Stack, Typography } from "~/ui";

import { Money } from "~/ui";
import { Location } from "../../../data/locations";

type Props = {
  price: number;
  location: Location;
}

export const RailroadCard: FC<Props> = (props) => {
  const { price, location } = props;

  if (location.type !== "railroad") return <></>;

  return (
    <Stack spacing={1} className="mx-3">
      <Stack direction="row" className="justify-center items-center mt-1" spacing={1}>
        <Typography level="body-sm">Price</Typography>
        <Money amount={price} />
      </Stack>

      <Divider />

      <Stack direction="row" className="justify-center items-center mt-1" spacing={1}>
        <Typography level="body-sm">Rent</Typography>
        <Money variant="outlined" amount={location.rent1} />
      </Stack>
      {[location.rent2, location.rent3, location.rent4].map((rent, i) => (
        <Stack key={i} direction="row" className="justify-between items-center mt-1" spacing={1}>
          <Typography level="body-sm">With {i + 2} railroads</Typography>
          <Money variant="outlined" amount={rent} />
        </Stack>
      ))}
    </Stack>
  );
};
