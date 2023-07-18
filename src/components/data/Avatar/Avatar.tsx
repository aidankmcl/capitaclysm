
import { FC, CSSProperties } from 'react';

import { PlayerData } from '~/store';

type Props = {
  player: PlayerData;
  fontSize?: number;
  center?: boolean;
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
  const { player, fontSize, center } = props;
  return (
    <div style={{
      ...stylesContainer,
      fontSize,
      backgroundImage: props.player.color,
      ...(center ? stylesCenteredContainer : {})
    }}>
      <span style={{ fontWeight: 'bold' }}>{player.name.charAt(0).toUpperCase()}</span>
    </div>
  );
};
