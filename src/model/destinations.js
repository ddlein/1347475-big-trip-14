import Observer from '../utils/observer';

export default class Destinations extends Observer {
  constructor() {
    super();
    this._destinations = null;
  }

  set(destinations) {
    this._destinations = destinations.slice();
  }

  get() {
    return this._destinations;
  }
}
