import AbstractView from './abstract';

const createWaypointsListTemplate = () => {
  return '<ul class="trip-events__list"></ul>';
};

export default class WaypointList extends AbstractView {
  getTemplate() {
    return createWaypointsListTemplate();
  }
}
