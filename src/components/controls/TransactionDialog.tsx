import { Card, Divider, Typography, Button, Modal, Money } from "~/ui";

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
      <div className="flex flex-col">
        {title && (
          <Card className="m-[-3px] mb-3 rounded-t-none">
            <Typography level="h2">{title}</Typography>
          </Card>
        )}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch">
          <Card className="max-w-sm">
            <LocationCard location={location} />
          </Card>

          <div className="flex flex-col gap-3">
            <Card>
              <Typography className="text-center mb-2" level="h4">Effect on funds</Typography>

              <div className="flex flex-col gap-1 items-end mt-0">
                <Money amount={startMoney} />
                <Money amount={- cost} />
                <Divider />
                <Money amount={startMoney - cost} />
              </div>
            </Card>

            <Card>
              <div className="m-[-1rem] p-2.5 rounded-md">
                {startMoney >= cost ? (
                  <div className="flex flex-row gap-2">
                    <Button color="success" variant="soft" className="flex-grow" onClick={accept}>
                      Accept
                    </Button>
                    {reject && (
                      <Button color="danger" variant="soft" className="flex-grow" onClick={reject}>
                        Decline 
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button color="danger" variant="soft" className="w-full" onClick={reject}>
                    Decline
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Modal>
  );
}; 