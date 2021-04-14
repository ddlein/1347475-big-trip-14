import SiteMenuView from './view/siteMenu';
import SortView from './view/sort';
import WaypointsListView from './view/way-point-list';
import WaypointView from './view/waypoint';
import WaypointEditView from './view/edit-form.js';
import FiltersView from './view/filter.js';
import TripInfoView from './view/route.js';
import NoWaypointView from './view/empty-list';
import {generateRoute} from './mock/route.js';
import {render, RenderPosition} from './utils.js';
import '../src/mock/route.js';

const POINT_COUNT = 20;

const points = new Array(POINT_COUNT).fill('').map(generateRoute).sort(((a, b) => {
  if (a.dateTo > b.dateTo) {
    return 1;
  }
  if (a.dateTo < b.dateTo) {
    return -1;
  }
  return 0;
}));


const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-body__page-main');
const tripMainElement = headerElement.querySelector('.trip-main');
const menuElement = headerElement.querySelector('.trip-controls__navigation');
const filtersElement = headerElement.querySelector('.trip-controls__filters');
const eventsElement = mainElement.querySelector('.trip-events');

const waypointListComponent = new WaypointsListView();

const renderWaypoint = (waypointListElement, waypoint) => {
  const waypointComponent = new WaypointView(waypoint);
  const waypointEditComponent = new WaypointEditView(waypoint);

  const replaceWaypointToEdit = () => {
    waypointListElement.replaceChild(waypointEditComponent.getElement(), waypointComponent.getElement());
  };

  const createEventListener = (selector, typeOfEvent) => {
    selector.addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceWaypointToList();
      document.removeEventListener(typeOfEvent, onEscKeyDown);
    });
  };

  const replaceWaypointToList = () => {
    waypointListElement.replaceChild(waypointComponent.getElement(), waypointEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceWaypointToList();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  waypointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceWaypointToEdit();
    document.addEventListener('keydown', onEscKeyDown);
  });

  createEventListener(waypointEditComponent.getElement().querySelector('form'), 'submit');
  createEventListener(waypointEditComponent.getElement().querySelector('.event__rollup-btn'), 'click');

  render(waypointListElement, waypointComponent.getElement(), RenderPosition.BEFOREEND);
};

if (points.length === 0) {
  render(eventsElement, new NoWaypointView().getElement(), RenderPosition.BEFOREEND);
} else {
  render(tripMainElement, new TripInfoView(points).getElement(), RenderPosition.AFTERBEGIN);

}


render(menuElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
render(filtersElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);
render(eventsElement, waypointListComponent.getElement(), RenderPosition.AFTERBEGIN);
render(eventsElement, new SortView().getElement(), RenderPosition.AFTERBEGIN);


for (let i = 0; i < points.length; i++) {
  renderWaypoint(waypointListComponent.getElement(), points[i]);
}


