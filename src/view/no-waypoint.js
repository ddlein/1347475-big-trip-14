import AbstractView from './abstract';

const createNoWaypointTemplate = () => {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
};

export default class Filters extends AbstractView {
  getTemplate() {
    return createNoWaypointTemplate();
  }
}
