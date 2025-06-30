import { FC } from "react";

import { List } from "~/ui";
import { selectors, useAppSelector } from "~/store";
import { LocationCard } from "../data";

export const PropertiesList: FC = () => {
  const properties = useAppSelector(selectors.locations.selectClientPlayerProperties);

  return (
    <List
      items={properties.map(location => ({
        content: (
          <LocationCard location={location} />
        )
      }))}
    />
  );
}; 