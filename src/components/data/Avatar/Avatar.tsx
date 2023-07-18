
import { FC, CSSProperties } from 'react';
import { colors } from '~/components';

import { PlayerData } from '~/store';

type Props = {
  player: PlayerData;
  fontSize?: number;
  center?: boolean;
  activePlayerID?: string;
  style?: CSSProperties;
}

const avatarSizeEm = 2.5;

const stylesContainer: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: avatarSizeEm + 'em',
  height: avatarSizeEm + 'em',
  borderRadius: '100%',
  textAlign: 'center',
  verticalAlign: 'middle',
};

const stylesCenteredContainer: CSSProperties = {
  position: 'relative',
  left: -(avatarSizeEm / 2) + 'em',
  top: -(avatarSizeEm / 2) + 'em'
};

// Not using Joy UI because custom Map markers don't work with them correctly
export const Avatar: FC<Props> = (props) => {
  const { player, fontSize, center, activePlayerID } = props;
  return (
    <div style={{
      ...stylesContainer,
      fontSize,
      backgroundImage: props.player.color,
      boxShadow: activePlayerID === props.player.id ? `0px 0px 10px 3px ${colors.green}` : '',
      ...(center ? stylesCenteredContainer : {}),
      ...props.style
    }}>
      <span style={{ fontWeight: 'bold' }}>{player.name.charAt(0).toUpperCase()}</span>
    </div>
  );
};
