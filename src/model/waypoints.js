import Observer from '../utils/observer';

export default class Waypoints extends Observer {
  constructor() {
    super();
    this._waypoints = [];
  }

  set(updateType, waypoints) {
    this._waypoints = waypoints.slice();
    this._notify(updateType);
  }

  get() {
    return this._waypoints;
  }

  update(updateType, update) {
    const index = this._waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }

    this._waypoints = [
      ...this._waypoints.slice(0, index),
      update,
      ...this._waypoints.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  add(updateType, update) {
    this._waypoints = [
      update,
      ...this._waypoints,
    ];

    this._notify(updateType, update);
  }

  delete(updateType, update) {
    const index = this._waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }

    this._waypoints = [
      ...this._waypoints.slice(0, index),
      ...this._waypoints.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(waypoint) {
    const adaptedWaypoint = Object.assign(
      {},
      waypoint,
      {
        isFavorite: waypoint.is_favorite,
        dateFrom: waypoint.date_from !== null ? new Date(waypoint.date_from) : waypoint.date_from,
        dateTo: waypoint.date_to !== null ? new Date(waypoint.date_to) : waypoint.date_to,
        basePrice: waypoint.base_price,
      },
    );

    delete adaptedWaypoint.is_favorite;
    delete adaptedWaypoint.date_from;
    delete adaptedWaypoint.date_to;
    delete adaptedWaypoint.base_price;

    return adaptedWaypoint;
  }

  static adaptToServer(waypoint) {
    const adaptedWaypoint = Object.assign(
      {},
      waypoint,
      {
        'date_from': waypoint.dateFrom,
        'date_to': waypoint.dateTo,
        'is_favorite': waypoint.isFavorite,
        'base_price': parseInt(waypoint.basePrice, 10),
      },
    );

    delete adaptedWaypoint.dateFrom;
    delete adaptedWaypoint.dateTo;
    delete adaptedWaypoint.isFavorite;
    delete adaptedWaypoint.basePrice;

    return adaptedWaypoint;
  }
}
