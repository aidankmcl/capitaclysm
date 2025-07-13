import { FC } from "react";
import { Divider, Typography } from "~/ui";

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
    <div className="flex flex-col gap-0 mx-3">
      <div className="flex flex-row gap-1 justify-center items-center mt-1">
        <Typography level="body-sm">Price</Typography>
        <Money amount={price} />
      </div>

      <Divider className="my-1" />

      <div className="flex flex-row gap-1 justify-center items-center">
        <Typography level="body-sm">Base rent</Typography>
        <Money variant="outlined" amount={location.baseRent} />
      </div>
      {[location.rent1, location.rent2, location.rent3, location.rent4].map((rent, i) => (
        <div key={i} className="flex flex-row gap-1 justify-between items-center">
          <Typography level="body-sm">{i + 1} house{i > 0 ? "s" : ""}</Typography>
          <Money variant="outlined" amount={rent} />
        </div>
      ))}
      <div className="flex flex-row gap-1 justify-between items-center">
        <Typography level="body-sm">With hotel</Typography>
        <Money variant="outlined" amount={location.rent5} />
      </div>
    </div>
  );
};
