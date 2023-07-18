import { List as JoyList, ListDivider, ListItem, ListItemContent, ListItemDecorator } from '@mui/joy';
import { FC } from 'react';

type DividerProps = Parameters<typeof ListDivider>[0];

type ListItem = {
  decorator?: JSX.Element;
  content: JSX.Element;
}

type Props = {
  items: ListItem[];
  divider?: DividerProps['inset'];
  title?: string;
}

export const List: FC<Props> = (props) => {
  return <JoyList aria-label={props.title ?? 'list'}>
    {props.items.map((item, i) => (
      <ListItem key={i}>
        {item.decorator ?? <ListItemDecorator>{item.decorator}</ListItemDecorator>}
        <ListItemContent>{item.content}</ListItemContent>
        {props.divider && i < props.items.length - 1 && <ListDivider inset={props.divider} />}
      </ListItem>
    ))}
  </JoyList>;
};
