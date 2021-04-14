import {createElement} from '../utils';

const createWaypointsListTemplate = () => {
  return '<ul class="trip-events__list"></ul>';
};

export default class WaypointsList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createWaypointsListTemplate();
  }

  getElement() {
    if (this._element === null) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
