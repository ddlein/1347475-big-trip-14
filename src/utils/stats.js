import {getDiffTimeInMinutes, getParsedDurationFromMinutes} from './waypoint';

const makeItemsUniq = (items) => [...new Set(items)];

const countWayPointsByType = (waypoints, type) => {
  const waypointsCount = waypoints.filter((waypoint) => waypoint.type === type).length;
  return {type, waypointsCount};
};

const countPriceWaypointsByType = (waypoints, type) => {
  let price = 0;
  const filteredWaypoints = waypoints.filter((waypoint) => waypoint.type === type);

  filteredWaypoints.forEach((waypoint) => {
    price += waypoint.basePrice;
  });

  return {type, price};
};

const countMinutesWaypointsByType = (waypoints, type) => {
  let timeInMinutes = 0;
  const filteredWaypoints = waypoints.filter((waypoint) => waypoint.type === type);

  filteredWaypoints.forEach((waypoint) => {
    timeInMinutes += getDiffTimeInMinutes(waypoint.dateFrom, waypoint.dateTo);
  });
  return {type, timeInMinutes};
};

const countTimeWaypointsByType = (waypoints, type) => {
  let timeInMinutes = 0;
  const filteredWaypoints = waypoints.filter((waypoint) => waypoint.type === type);

  filteredWaypoints.forEach((waypoint) => {
    timeInMinutes += getDiffTimeInMinutes(waypoint.dateFrom, waypoint.dateTo);
  });

  return getParsedDurationFromMinutes(timeInMinutes);
};

export {
  makeItemsUniq,
  countWayPointsByType,
  countPriceWaypointsByType,
  countTimeWaypointsByType,
  countMinutesWaypointsByType
};
