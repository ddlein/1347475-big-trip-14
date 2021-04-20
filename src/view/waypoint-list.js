import AbstractView from './abstract';

const createWaypointsListTemplate = () =>{
  return '<ul class="trip-events__list"></ul>';
};

export default class Filters extends AbstractView {
  getTemplate() {
    return createWaypointsListTemplate();
  }
}
