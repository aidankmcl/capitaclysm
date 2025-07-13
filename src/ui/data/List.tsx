import { FC, JSX } from "react";
import { List as JoyList, ListItem, ListItemContent, ListItemDecorator, ListDivider } from "@mui/joy";

type Props = {
  title?: string;
  items: Array<{
    content: JSX.Element;
    decorator?: JSX.Element;
  }>;
  divider?: "gutter" | "startDecorator" | "startContent" | "context";
};

export const List: FC<Props> = (props) => {
  return (
    <JoyList 
      aria-label={props.title ?? "list"}
      className="bg-primary rounded-md border border-tertiary"
    >
      {props.items.map((item, i) => (
        <ListItem 
          key={i}
          className="text-text hover:bg-tertiary hover:text-textSecondary transition-colors"
        >
          {item.decorator && <ListItemDecorator>{item.decorator}</ListItemDecorator>}
          <ListItemContent>{item.content}</ListItemContent>
          {props.divider && i < props.items.length - 1 && (
            <ListDivider 
              inset={props.divider} 
              className="border-tertiary"
            />
          )}
        </ListItem>
      ))}
    </JoyList>
  );
};
