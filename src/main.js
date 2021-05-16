import SiteMenuView from './view/site-menu.js';
// import FiltersView from './view/filters.js';
import TripInfoView from './view/trip-info.js';
import { generateRoute, generateOffers, generatePhotoAndDescription } from './mock/route.js';
import { render, RenderPosition, remove } from './utils/render.js';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter.js';
import WaypointsModel from './model/waypoint';
import FilterModel from './model/filter';
import {MenuItem} from './const.js';
import StatsView from './view/stats.js';
import '../src/mock/route.js';

const POINT_COUNT = 20;

const waypoints = new Array(POINT_COUNT).fill('').map(generateRoute);

const waypointsModel = new WaypointsModel();
waypointsModel.setWaypoints(waypoints);

const typeAndOffers = generateOffers();
const citiesWithPhotosAndDescription = generatePhotoAndDescription();

const filterModel = new FilterModel();

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-body__page-main');
const tripMainElement = headerElement.querySelector('.trip-main');
const menuElement = headerElement.querySelector('.trip-controls__navigation');
const filtersElement = headerElement.querySelector('.trip-controls__filters');
const eventsElement = mainElement.querySelector('.trip-events');
const mainContainer = mainElement.querySelector('.page-body__container');


if (waypoints.length > 0) {
  render(tripMainElement, new TripInfoView(waypoints), RenderPosition.AFTERBEGIN);
}

let statisticsComponent = null;

const siteMenuComponent = new SiteMenuView();
render(menuElement, siteMenuComponent);

const tripPresenter = new TripPresenter(eventsElement, waypointsModel, typeAndOffers, citiesWithPhotosAndDescription, filterModel);
const filterPresenter = new FilterPresenter(filtersElement, filterModel, waypointsModel);


filterPresenter.init();
tripPresenter.init();


document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createWaypoint();
});

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticsComponent = new StatsView(waypointsModel.getWaypoints());
      render(mainContainer, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
