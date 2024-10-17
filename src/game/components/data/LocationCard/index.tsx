
import { Divider, Stack, Typography } from '@mui/joy';
import { FC } from 'react';

import { LocationData } from '~/store';
import { Location, getLocationByIndex } from '~/data/map';
import { Money } from '~/components';

import { PropertyCard } from './PropertyCard';
import { RailroadCard } from './RailroadCard';
import { UtilityCard } from './UtilityCard';

type Props = {
  location: LocationData;
  overridePrice?: number;
}

const CardInfo: FC<Props & { baseLocation: Location}> = (props) => {
  const { location, baseLocation } = props;

  switch (location.type) {
    case 'property':
      return <PropertyCard price={props.overridePrice || location.price} location={baseLocation} />;
    case 'railroad':
      return <RailroadCard price={props.overridePrice || location.price} location={baseLocation} />;
    case 'utility':
      return <UtilityCard price={props.overridePrice || location.price} location={baseLocation} />;
    case 'event':
    default:
      return <Typography level="body1">{baseLocation.type}</Typography>;
  }
};

export const LocationCard: FC<Props> = (props) => {
  const { location } = props;

  const baseLocation = getLocationByIndex(location.locationIndex);
  if (!baseLocation) return <></>;

  return (
    <Stack>
      <Typography level="h3" textAlign="center" fontWeight="bold">{location.name}</Typography>
      <CardInfo {...props} baseLocation={baseLocation} />
      {location.type !== 'event' && (
        <Stack mx={3} mt={2} spacing={2}>
          <Divider />
          <Stack direction="row" justifyContent="space-between">
            <Typography level="body2">Mortgage value:</Typography>
            <Money variant="plain" amount={(location.price || 0) / 2} />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
