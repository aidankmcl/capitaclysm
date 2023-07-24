import { FC } from "react";
import { Divider, Stack, Typography } from "@mui/joy";

import { Money } from "~/components";
import { Location } from "~/data/map";

type Props = {
  price: number;
  location: Location;
}

export const RailroadCard: FC<Props> = (props) => {
  const { price, location } = props;

  if (location.type !== "railroad") return <></>;

  return (
    <Stack spacing={1} mx={3}>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mt={1}>
        <Typography level="body2">Price</Typography>
        <Money amount={price} />
      </Stack>

      <Divider />

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mt={1}>
        <Typography level="body2">Rent</Typography>
        <Money variant="plain" amount={location.rent1} />
      </Stack>
      {[location.rent2, location.rent3, location.rent4].map((rent, i) => (
        <Stack key={i} direction="row" justifyContent="space-between" alignItems="center" spacing={1} mt={1}>
          <Typography level="body2">With {i + 2} railroads</Typography>
          <Money variant="plain" amount={rent} />
        </Stack>
      ))}
    </Stack>
  )
}
