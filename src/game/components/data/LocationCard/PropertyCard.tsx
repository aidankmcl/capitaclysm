import { FC } from "react";
import { Divider, Stack, Typography } from "@mui/joy";

import { Money } from "~/components";
import { Location } from "~/data/map";

type Props = {
  price: number;
  location: Location;
}

export const PropertyCard: FC<Props> = (props) => {
  const { price, location } = props;

  if (location.type !== "property") return <></>;

  return (
    <Stack spacing={0} mx={3}>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mt={1}>
        <Typography level="body2">Price</Typography>
        <Money amount={price} />
      </Stack>

      <Divider sx={{ my: 1 }} />

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
        <Typography level="body2">Base rent</Typography>
        <Money variant="plain" amount={location.baseRent} />
      </Stack>
      {[location.rent1, location.rent2, location.rent3, location.rent4].map((rent, i) => (
        <Stack key={i} direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Typography level="body2">{i + 1} house{i > 0 ? 's' : ''}</Typography>
          <Money variant="plain" amount={rent} />
        </Stack>
      ))}
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Typography level="body2">With hotel</Typography>
        <Money variant="plain" amount={location.rent5} />
      </Stack>
    </Stack>
  )
}
