import { FC, CSSProperties } from "react";
import { PlayerData } from "~/store";

type Props = {
  player: PlayerData;
  fontSize?: number;
  center?: boolean;
  activePlayerID?: string;
  style?: CSSProperties;
  className?: string;
}

const avatarSizeEm = 2.5;

const stylesContainer: CSSProperties = {
  width: avatarSizeEm + "em",
  height: avatarSizeEm + "em",
  verticalAlign: "middle",
};

const stylesCenteredContainer: CSSProperties = {
  position: "relative",
  left: -(avatarSizeEm / 2) + "em",
  top: -(avatarSizeEm / 2) + "em"
};

// Not using Joy UI because custom Map markers don't work with them correctly
export const Avatar: FC<Props> = (props) => {
  const { player, fontSize, center, activePlayerID, className } = props;
  return (
    <div 
      className={`flex items-center justify-center rounded-full text-center ${className || ""}`}
      style={{
        ...stylesContainer,
        fontSize,
        backgroundImage: props.player.color,
        boxShadow: activePlayerID === props.player.id ? `0px 0px 10px 3px var(--color-primary)` : "",
        ...(center ? stylesCenteredContainer : {}),
        ...props.style
      }}
    >
      <span className="font-bold">{player.name.charAt(0).toUpperCase()}</span>
    </div>
  );
};
