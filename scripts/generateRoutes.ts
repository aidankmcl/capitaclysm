import { resolve } from 'path';
import { writeFileSync } from 'fs';

import axios from 'axios';
import polyline from '@mapbox/polyline';

import { Coordinate, Location, locations } from '../src/game/components/map/data/locations';

type Route = Coordinate[];

const OUTPUT_PATH = resolve(__dirname, '../src/game/components/map/data/route.json');

const requestRoute = (route: Route) => {
  const routeURLParam = route.map(([lat, lon]) => [lon.toFixed(4), lat.toFixed(4)].join(',')).join(';')
  
  return axios.get(`http://router.project-osrm.org/route/v1/driving/${routeURLParam}?overview=full&continue_straight=true&steps=true&annotations=nodes&geometries=polyline6&snapping=any`)
    .then(res => res.data)
    .catch(err => {
      console.error(err);
    })
}

type Line = {
  points: Coordinate[];
  color: string;
  type: Location['type'];
  name: string;
}

type Data = {
  lines: Line[];
  bounds: {
    topLeft: Coordinate;
    bottomRight: Coordinate;
  }
}

const getDistance = (lat1, lon1, lat2, lon2, precision=4) => {
  var radlat1 = Math.PI * lat1.toFixed(precision) / 180
  var radlat2 = Math.PI * lat2.toFixed(precision) / 180
  var theta = lon1.toFixed(precision) - lon2.toFixed(precision)
  var radtheta = Math.PI * theta / 180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist)
  dist = dist * 180 / Math.PI
  dist = dist * 60 * 1.1515;
  return dist
}

type MatchData = {
  dist: number,
  coord: Coordinate,
  original: Coordinate,
  color: Location['color'],
  type: Location['type'],
  name: Location['name']
};

const organizeData = (coords: Coordinate[]): Data => {
  const bestMatches: { [K: string]: MatchData } = {};

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;

  coords.forEach(([lat, lon]) => {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;

    locations.forEach(({ name, position: [locLat, locLon], color, type }, i) => {
      const dist = getDistance(locLat, locLon, lat, lon);
      const data = { dist, coord: [lat, lon], original: [locLat, locLon], color, type, name } as MatchData;

      if (!bestMatches[i]) {
        bestMatches[i] = data;
      }

      if (dist < bestMatches[i].dist) {
        bestMatches[i] = data;
      }
    })
  });

  // Make data accessible from OSRM waypoint coords
  Object.values(bestMatches).forEach(data => {
    bestMatches[data.coord.join(',')] = data;
  })

  const lines: Line[] = coords.reduce((acc, nextCoord, i) => {
    const data = bestMatches[nextCoord.join(',')];

    if (!data && acc.length) {
      acc[acc.length - 1].points.push(nextCoord);
    } else if (data) {
      if (acc.length) {
        acc[acc.length - 1].points.push(nextCoord); // This connects different segments
      }
      if (i !== coords.length - 1) acc.push({ points: [nextCoord], color: data.color, type: data.type, name: data.name });
    }
    return acc;
  }, [] as Line[]);

  return {
    lines,
    bounds: {
      // Note: whether min or max is location based, this assumes West of Prime Meridian and North of Equator (US is there)
      topLeft: [maxLat, minLon],
      bottomRight: [minLat, maxLon]
    }
  };
}

const main = async () => {
  const route = locations.map(location => location.position);
  route.push(locations[0].position); // want to wrap back around to start
  const data = await requestRoute(route);
  const waypoints = polyline.decode(data.routes[0].geometry, 6);

  writeFileSync(OUTPUT_PATH, JSON.stringify(organizeData(waypoints), null, 2));
}

main()
  .then(() => {
    console.log('success');
  })
  .catch((err) => {
    console.error('failed to pull routing information:', err);
  })
