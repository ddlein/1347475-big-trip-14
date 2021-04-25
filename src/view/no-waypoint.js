import AbstractView from './abstract';

const createNoWaypointTemplate = () => {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
};

export default class NoWaypoint extends AbstractView {
  getTemplate() {
    return createNoWaypointTemplate();
  }
}
