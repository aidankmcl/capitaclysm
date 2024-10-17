
import { FC } from "react";
import { Box, Card, Divider, Stack, Typography } from "@mui/joy";

import { Button, Modal, Money } from "~/components";
import { PropertyDeal, actions, selectors, useAppDispatch, useAppSelector } from "~/store";

import { LocationCard } from "../../data";

export const DealModalProvider: FC = () => {

  const deals = useAppSelector(selectors.deals.selectPendingAugmented);
  const dispatch = useAppDispatch();

  const activeDeal = deals[0];
  if (!activeDeal) return <></>;

  const close = (status: PropertyDeal['status']) => {
    const currentOwners = activeDeal.location.owners;
    const percentage = 0.01 * Math.floor(100 / (currentOwners.length + 1)); // for now make it equal across owners

    const owners = currentOwners.reduce((acc, next) => {
      acc.push({ ...next, percentOwnership: percentage });
      return acc;
    }, [{ playerID: activeDeal.playerID, percentOwnership: percentage }]);

    dispatch(
      actions.deals.close({
        id: activeDeal.id,
        status,
        deal: activeDeal,
        owners
      })
    );
  };

  return (
    <Modal
      forceAnswer={true}
      onClose={() => close('rejected')}
      sx={{ background: activeDeal.location.color, p: 3 }}
    >
      <Stack spacing={3} alignItems={{ xs: "stretch", lg: "start" }} direction={{ xs: "column", lg: "row" }}>
        <Card>
          <LocationCard location={activeDeal.location} />
        </Card>

        <Stack spacing={3}>
          <Card>
            <Typography textAlign="center" level="h4" mb={2}>Effect on funds</Typography>

            <Stack direction="column" spacing={1} alignItems="end" marginTop={0}>
              <Money amount={activeDeal.player.money} />
              <Money amount={- activeDeal.price} />
              <Divider />
              <Money amount={activeDeal.player.money - activeDeal.price} />
            </Stack>
          </Card>

          <Card>
            <Box
              sx={{
                m: 'calc(-1 * var(--Card-padding))',
                p: 2.5,
                borderRadius: 'var(--joy-radius-md)'
              }}
            >
              {activeDeal.player.money >= activeDeal.price ? (
                <Stack direction="row" spacing={2}>
                  <Button color="success" variant="soft" sx={{ flexGrow: 1 }} onClick={() => close('accepted')}>
                    Accept
                  </Button>
                  <Button color="danger" variant="soft" sx={{ flexGrow: 1 }} onClick={() => close('rejected')}>
                    Decline 
                  </Button>
                </Stack>
              ) : (
                <Button color="danger" variant="soft" sx={{ width: '100%' }} onClick={() => close('rejected')}>
                  Accept Brokeness
                </Button>
              )}
            </Box>
          </Card>
        </Stack>
      </Stack>
    </Modal>
  )
}
