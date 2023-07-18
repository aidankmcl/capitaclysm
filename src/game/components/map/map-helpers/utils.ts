
import { Coordinate } from '../data/locations';
import { BOUNDS_PADDING, DEFAULT_ZOOM } from './constants';

export const getPaddedBounds = (topLeft: number[], bottomRight: number[]): [Coordinate, Coordinate] => {
  if (topLeft.length !== 2 || bottomRight.length !== 2) return [[0, 0], [0, 0]];

  return [
    [topLeft[0] + BOUNDS_PADDING, topLeft[1] - BOUNDS_PADDING],
    [bottomRight[0] - BOUNDS_PADDING, bottomRight[1] + BOUNDS_PADDING],
  ];
};

const DEFAULT_MARKER_FONT = 18;

export const scaleFont = (zoom: number) => DEFAULT_MARKER_FONT + ((zoom - DEFAULT_ZOOM) * 5);
