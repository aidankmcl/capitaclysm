import { Box, Card, Divider, Stack, Typography, Button, Modal, Money } from "~/ui";

import { LocationData } from "~/store";

import { LocationCard } from "../locations";
import { FC } from "react";

type Props = {
  location: LocationData;
  startMoney: number;
  cost: number;
  accept: () => void;
  reject?: () => void;
  title?: string;
}

const PADDING = 3;

export const TransactionDialog: FC<Props> = (props) => {
  const { title, location, startMoney, cost, accept, reject } = props;

  return (
    <Modal
      forceAnswer={true}
      onClose={reject}
      className={`p-[${PADDING}px] border-none background-[${location.color}]`}
    >
      <Stack>
        {title && (
          <Card className="m-[-3px] mb-3 rounded-t-none">
            <Typography level="h2">{title}</Typography>
          </Card>
        )}
        <Stack spacing={PADDING} alignItems="stretch" className="flex-col lg:flex-row">
          <Card sx={{ maxWidth: "300px" }}>
            <LocationCard location={location} />
          </Card>

          <Stack spacing={PADDING}>
            <Card>
              <Typography className="text-center mb-2" level="h4">Effect on funds</Typography>

              <Stack direction="column" spacing={1} alignItems="end" className="mt-0">
                <Money amount={startMoney} />
                <Money amount={- cost} />
                <Divider />
                <Money amount={startMoney - cost} />
              </Stack>
            </Card>

            <Card>
              <Box
                sx={{
                  m: "calc(-1 * var(--Card-padding))",
                  p: 2.5,
                  borderRadius: "var(--joy-radius-md)"
                }}
              >
                {startMoney >= cost ? (
                  <Stack direction="row" spacing={2}>
                    <Button color="success" variant="soft" sx={{ flexGrow: 1 }} onClick={accept}>
                      Accept
                    </Button>
                    {reject && (
                      <Button color="danger" variant="soft" sx={{ flexGrow: 1 }} onClick={reject}>
                        Decline 
                      </Button>
                    )}
                  </Stack>
                ) : (
                  <Button color="danger" variant="soft" sx={{ width: "100%" }} onClick={reject}>
                    Decline
                  </Button>
                )}
              </Box>
            </Card>
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  );
}; 