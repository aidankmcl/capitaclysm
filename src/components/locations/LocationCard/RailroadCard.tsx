import { FC } from "react";
import { Divider, Typography } from "~/ui";

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
    <div className="flex flex-col gap-1 mx-3">
      <div className="flex flex-row gap-1 justify-center items-center mt-1">
        <Typography level="body-sm">Price</Typography>
        <Money amount={price} />
      </div>

      <Divider />

      <div className="flex flex-row gap-1 justify-center items-center mt-1">
        <Typography level="body-sm">Rent</Typography>
        <Money variant="outlined" amount={location.rent1} />
      </div>
      {[location.rent2, location.rent3, location.rent4].map((rent, i) => (
        <div key={i} className="flex flex-row gap-1 justify-between items-center mt-1">
          <Typography level="body-sm">With {i + 2} railroads</Typography>
          <Money variant="outlined" amount={rent} />
        </div>
      ))}
    </div>
  );
};
