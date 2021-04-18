import SiteMenuView from './view/site-menu.js';
import SortView from './view/sort.js';
import WaypointsListView from './view/waypoint-list';
import WaypointView from './view/waypoint';
import WaypointEditView from './view/waypoint-edit.js';
import FiltersView from './view/filters.js';
import TripInfoView from './view/trip-info.js';
import NoWaypointView from './view/no-waypoint';
import {generateRoute} from './mock/route.js';
import {render, replace, RenderPosition} from './utils/render.js';
import {isEscEvent} from './utils/common.js';
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
    replace(waypointEditComponent, waypointComponent);
  };

  const replaceWaypointToList = () => {
    replace(waypointComponent, waypointEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      replaceWaypointToList();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  waypointComponent.setRollupClickHandler(() => {
    replaceWaypointToEdit();
    document.addEventListener('keydown', onEscKeyDown);
  });

  waypointEditComponent.setFormSubmitHandler(() => {
    replaceWaypointToList();
    document.removeEventListener('submit', onEscKeyDown);
  });

  waypointEditComponent.setFormClickHandler(() => {
    replaceWaypointToList();
    document.removeEventListener('click', onEscKeyDown);
  });

  render(waypointListElement, waypointComponent);
};

if (points.length === 0) {
  render(eventsElement, new NoWaypointView());
} else {
  render(tripMainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
}


render(menuElement, new SiteMenuView());
render(filtersElement, new FiltersView());
render(eventsElement, waypointListComponent, RenderPosition.AFTERBEGIN);
render(eventsElement, new SortView(), RenderPosition.AFTERBEGIN);


for (let i = 0; i < points.length; i++) {
  renderWaypoint(waypointListComponent, points[i]);
}


