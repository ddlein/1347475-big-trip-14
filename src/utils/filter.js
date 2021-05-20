import {FilterType} from '../const';
import {isFuture, isPast} from '../utils/waypoint';

const filter = {
  [FilterType.EVERYTHING]: (waypoints) => waypoints,
  [FilterType.FUTURE]: (waypoints) => waypoints.filter((waypoint) => isFuture(waypoint.dateFrom, waypoint.dateTo)),
  [FilterType.PAST]: (waypoints) => waypoints.filter((waypoint) => isPast(waypoint.dateFrom, waypoint.dateTo)),
};

export {filter};
