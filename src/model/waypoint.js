import Observer from '../utils/observer';

export default class Waypoints extends Observer {
  constructor() {
    super();
    this._waypoints = [];
  }

  set(waypoints) {
    this._waypoints = waypoints.slice();
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
}
