import SiteMenuView from './view/site-menu.js';
import NewPointButtonView from './view/new-point-button-view.js';
import {
  generateRoute,
  generateOffers,
  generatePhotoAndDescription,
} from './mock/route.js';
import { render, RenderPosition, remove } from './utils/render.js';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter.js';
import TripInfoPresenter from './presenter/tripinfo';
import WaypointsModel from './model/waypoint';
import FilterModel from './model/filter';
import DestinationsModel from './model/destinations';
import OffersModel from './model/offers';
import { MenuItem, UpdateType } from './const.js';
import StatsView from './view/stats.js';
import Api from './api.js';
import '../src/mock/route.js';

//const POINT_COUNT = 20;

const AUTHORIZATION = 'Basic kTy9gIdsz2317rD';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

//const waypoints = new Array(POINT_COUNT).fill('').map(generateRoute);

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-body__page-main');
const tripMainElement = headerElement.querySelector('.trip-main');
const menuElement = headerElement.querySelector('.trip-controls__navigation');
const filtersElement = headerElement.querySelector('.trip-controls__filters');
const eventsElement = mainElement.querySelector('.trip-events');
const mainContainer = mainElement.querySelector('.page-body__container');

const api = new Api(END_POINT, AUTHORIZATION);

const waypointsModel = new WaypointsModel();
const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
//waypointsModel.set(waypoints);

const siteMenuComponent = new SiteMenuView();
export const newPointButtonComponent = new NewPointButtonView();

// const typeAndOffers = generateOffers();
// const citiesWithPhotosAndDescription = generatePhotoAndDescription();

const tripPresenter = new TripPresenter(
  eventsElement,
  waypointsModel,
  offersModel,
  destinationsModel,
  filterModel,
  api,
);
const filterPresenter = new FilterPresenter(
  filtersElement,
  filterModel,
  waypointsModel,
);
const tripInfoPresenter = new TripInfoPresenter(
  tripMainElement,
  waypointsModel,
);

let statisticsComponent = null;


newPointButtonComponent.setClickHandler(() => {
  newPointButtonComponent.setDisabled();
  tripPresenter.createWaypoint();
});

tripPresenter.init();

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.init();
      remove(statisticsComponent);
      newPointButtonComponent.removeDisabled();
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticsComponent = new StatsView(waypointsModel.get());
      render(mainContainer, statisticsComponent, RenderPosition.BEFOREEND);
      newPointButtonComponent.setDisabled();
      break;
  }
};


Promise.all([
  api.getOffers(),
  api.getDestinations(),
  api.getPoints(),
]).then(([offers, destinations, points]) => {
  offersModel.set(offers);
  destinationsModel.set(destinations);
  waypointsModel.set(UpdateType.INIT, points);
  //console.log(points);
  //console.log(offers);
  //render(tripMainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
  tripInfoPresenter.init();
  filterPresenter.init();
  render(menuElement, siteMenuComponent);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  render(tripMainElement, newPointButtonComponent);
})
  .catch((e) => {
    console.log(e);
    offersModel.set([]);
    destinationsModel.set([]);
    waypointsModel.set(UpdateType.INIT, []);
    render(menuElement, siteMenuComponent);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });

// api.getDestinations().then((destinations) => {
//   //console.log(destinations);
//   destinationsModel.set(UpdateType.INIT, destinations);
// }).catch((e) => {
//   console.log(e);
//   destinationsModel.set(UpdateType.INIT, []);
// });

// api.getOffers().then((offers) => {
//   //console.log(offers);
//   offersModel.set(UpdateType.INIT, offers);
// }).catch((e) => {
//   console.log(e);
//   offersModel.set(UpdateType.INIT, []);
// });

// api.getPoints().then((points) => {
//   //console.log(points);
//   waypointsModel.set(UpdateType.INIT, points);
//   render(menuElement, siteMenuComponent);
//   siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
// }).catch((e) => {
//   console.log(e);
//   waypointsModel.set(UpdateType.INIT, []);
//   render(menuElement, siteMenuComponent);
//   siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
// });



// if (waypoints.length > 0) {
//   render(tripMainElement, new TripInfoView(waypoints), RenderPosition.AFTERBEGIN);
// }



//render(menuElement, siteMenuComponent);
//console.log(waypointsModel.get());


// document
//   .querySelector('.trip-main__event-add-btn')
//   .addEventListener('click', (evt) => {
//     evt.preventDefault();
//     tripPresenter.createWaypoint();
//   });



//siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
