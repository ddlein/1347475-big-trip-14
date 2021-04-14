// import {createEditFormTemplate} from './view/edit-form.js';
//import {createFiltersTemplate} from './view/filter.js';
// import {createMenuTemplate} from './view/menu.js';
import SiteMenuView from './view/siteMenu';
// import {createRouteTemplate} from './view/route.js';
// import {createSortTemplate} from './view/sort.js';
import SortView from './view/sort';
import WaypointsListView from './view/way-point-list';
import WaypointView from './view/waypoint';
import WaypointEditView from './view/edit-form.js';
import FiltersView from './view/filter.js';
import TripInfoView from './view/route.js';
// import TripEventsView from './view/trip-events';
// import {createWaypointsTemplate} from './view/waypoint.js';
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

  const replaceWaypointToList = () => {
    waypointListElement.replaceChild(waypointComponent.getElement(), waypointEditComponent.getElement());
  };

  waypointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceWaypointToEdit();
  });

  waypointEditComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceWaypointToList();
  });

  render(waypointListElement, waypointComponent.getElement(), RenderPosition.BEFOREEND);
};

render(tripMainElement, new TripInfoView(points).getElement(), RenderPosition.AFTERBEGIN);

render(menuElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
render(filtersElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);
render(eventsElement, waypointListComponent.getElement(), RenderPosition.AFTERBEGIN);
render(eventsElement, new SortView().getElement(), RenderPosition.AFTERBEGIN);
// renderTemplate(filtersElement, createFiltersTemplate(), 'beforeend');

// renderTemplate(waypointListComponent.getElement());

// render(waypointListComponent.getElement(), new WaypointEditView(points[0]).getElement(), RenderPosition.BEFOREEND);

for (let i = 0; i < points.length; i++) {
  renderWaypoint(waypointListComponent.getElement(), points[i]);
}

// const eventsList = document.querySelector('.trip-events__list');
// renderTemplate(waypointListComponent.getElement(), createEditFormTemplate(points[0]), RenderPosition.AFTERBEGIN);


