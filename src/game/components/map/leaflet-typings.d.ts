import 'leaflet';
import { LatLng, Control, ControlOptions, PathOptions } from 'leaflet';

type Options = ControlOptions & {
  waypoints: LatLng[];
  lineOptions: {
    styles: PathOptions[]
  },
  show: boolean,
  autoRoute: boolean,
  addWaypoints: boolean,
  routeWhileDragging: boolean,
  draggableWaypoints: boolean,
  fitSelectedRoutes: boolean,
  showAlternatives: boolean,
  createMarker: () => void
}

declare module 'leaflet' {
  const Routing: {
    control: (options: Options) => Control
  };
}