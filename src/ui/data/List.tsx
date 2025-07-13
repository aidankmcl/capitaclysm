import { FC, JSX } from "react";

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
    <ul 
      aria-label={props.title ?? "list"}
      className="bg-primary rounded-md border border-tertiary list-none p-0 m-0"
    >
      {props.items.map((item, i) => (
        <li 
          key={i}
          className="text-text hover:bg-tertiary hover:text-textSecondary transition-colors flex items-center p-3"
        >
          {item.decorator && (
            <div className="mr-3 flex-shrink-0 flex items-center">
              {item.decorator}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {item.content}
          </div>
          {props.divider && i < props.items.length - 1 && (
            <hr 
              className={`
                border-tertiary border-t border-0 my-2 w-full
                ${props.divider === "gutter" ? "mx-0" : ""}
                ${props.divider === "startDecorator" ? "ml-12" : ""}
                ${props.divider === "startContent" ? "ml-16" : ""}
                ${props.divider === "context" ? "mx-4" : ""}
              `}
            />
          )}
        </li>
      ))}
    </ul>
  );
};
