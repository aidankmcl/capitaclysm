import { Divider, Stack, Typography } from "~/ui";
import { FC } from "react";

import { LocationData } from "~/store";
import { Location, getLocationByIndex } from "~/data";
import { Money } from "~/ui";

import { PropertyCard } from "./PropertyCard";
import { RailroadCard } from "./RailroadCard";
import { UtilityCard } from "./UtilityCard";

type Props = {
  location: LocationData;
  overridePrice?: number;
}

const CardInfo: FC<Props & { baseLocation: Location}> = (props) => {
  const { location, baseLocation } = props;

  switch (location.type) {
  case "property":
    return <PropertyCard price={props.overridePrice || location.price} location={baseLocation} />;
  case "railroad":
    return <RailroadCard price={props.overridePrice || location.price} location={baseLocation} />;
  case "utility":
    return <UtilityCard price={props.overridePrice || location.price} location={baseLocation} />;
  case "event":
  default:
    return <Typography level="body-lg">{baseLocation.type}</Typography>;
  }
};

export const LocationCard: FC<Props> = (props) => {
  const { location } = props;

  const baseLocation = getLocationByIndex(location.locationIndex);
  if (!baseLocation) return <></>;

  return (
    <Stack>
      <Typography level="h3" fontWeight="bold" sx={{ textAlign: "center" }}>{location.name}</Typography>
      <CardInfo {...props} baseLocation={baseLocation} />
      {location.type !== "event" && (
        <Stack className="mx-3 mt-2" spacing={2}>
          <Divider />
          <Stack direction="row" className="justify-between">
            <Typography level="body-sm">Mortgage value:</Typography>
            <Money variant="outlined" amount={(location.price || 0) / 2} />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
