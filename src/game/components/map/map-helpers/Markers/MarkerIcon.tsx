import { CSSProperties, FC} from 'react';

import { ReactComponent as RailroadIcon } from '~/assets/icons/railroad-sign.svg';
import { ReactComponent as WaterUtilityIcon } from '~/assets/icons/water-utility.svg';
import { ReactComponent as ElectricUtilityIcon } from '~/assets/icons/electric-utility.svg';
import { ReactComponent as TaxesIcon } from '~/assets/icons/taxes.svg';
import { ReactComponent as GoIcon } from '~/assets/icons/go.svg';
import { ReactComponent as JailIcon } from '~/assets/icons/jail.svg';
import { ReactComponent as GoToJailIcon } from '~/assets/icons/go-to-jail.svg';
import { PlayerData } from '~/store';

import { scaleFont } from '../utils';
import { Location } from '../../data/locations';

import styles from './MarkerIcon.module.css';

const SVG_SCALE = '1.6em';

const getIcon = (type: Location['icon'] | PlayerData['icon']) => {
  switch (type) {
    case 'railroad':
      return <RailroadIcon width={'2.25em'} height={'2.25em'} fill="black" />;
    case 'community':
        return <i className={`fi fi-ss-treasure-chest ${styles.markerIcon}`}></i>;
    case 'city-tax':
    case 'luxury-tax':
      return <TaxesIcon width={SVG_SCALE} height={SVG_SCALE} />;
    case 'chance':
      return <i className={`fi fi-sr-game ${styles.markerIcon}`}></i>;
    case 'water-utility':
      return <WaterUtilityIcon width={SVG_SCALE} height={SVG_SCALE}  />;
    case 'electric-utility':
      return <ElectricUtilityIcon width={SVG_SCALE} height={SVG_SCALE}  />;
    case 'go':
      return <GoIcon width={SVG_SCALE} height={SVG_SCALE}  />;
    case 'go-to-jail':
      return <GoToJailIcon width={'2.25em'} height={'2.25em'}  />;
    case 'jail':
      return <JailIcon width={'2em'} height={'2em'}  />;
    case 'free-parking':
      return <i className={`fi fi-ss-garage-car ${styles.markerIcon}`}></i>;
    case 'car':
      return <i className={`fi fi-bs-car ${styles.markerIcon}`}></i>;
    case 'property':
    default:
      return <i className={`fi fi-ss-house-chimney ${styles.markerIcon}`}></i>;
  }
};

export const MarkerIcon: FC<{ color: string, icon: Location['icon'] | PlayerData['icon'], zoom: number }> = (props) => {
  const scaledFont = scaleFont(props.zoom);
  return <div className={styles.marker} style={{ '--property-color': props.color, fontSize: scaledFont } as CSSProperties}>
    {getIcon(props.icon)}
  </div>;
};
