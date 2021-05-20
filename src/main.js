import SiteMenuView from './view/site-menu.js';
import NewPointButtonView from './view/new-point-button-view.js';
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
import Api from './api/api.js';
import {isOnline} from './utils/common.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import {toast} from './utils/toast.js';
import '../src/mock/route.js';


const AUTHORIZATION = 'Basic kTy9gIdsz2317rD';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'bigTrip-localstorage';
const STORE_VER = 'v14';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;


const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-body__page-main');
const tripMainElement = headerElement.querySelector('.trip-main');
const menuElement = headerElement.querySelector('.trip-controls__navigation');
const filtersElement = headerElement.querySelector('.trip-controls__filters');
const eventsElement = mainElement.querySelector('.trip-events');
const mainContainer = mainElement.querySelector('.page-body__container');

const api = new Api(END_POINT, AUTHORIZATION);

const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const waypointsModel = new WaypointsModel();
const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const siteMenuComponent = new SiteMenuView();
export const newPointButtonComponent = new NewPointButtonView();


const tripPresenter = new TripPresenter(
  eventsElement,
  waypointsModel,
  offersModel,
  destinationsModel,
  filterModel,
  apiWithProvider,
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
  if (!isOnline()) {
    toast('You can\'t create new point offline');
    siteMenuComponent.setMenuItem(MenuItem.TABLE);
    return;
  }
  newPointButtonComponent.setDisabled();
  tripPresenter.createWaypoint();

});

tripPresenter.init();
console.log(123);
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
  apiWithProvider.getPoints(),
]).then(([offers, destinations, points]) => {
  offersModel.set(offers);
  destinationsModel.set(destinations);
  waypointsModel.set(UpdateType.INIT, points);
  tripInfoPresenter.init();
  filterPresenter.init();
  render(menuElement, siteMenuComponent);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  render(tripMainElement, newPointButtonComponent);
})
  .catch(() => {
    offersModel.set([]);
    destinationsModel.set([]);
    waypointsModel.set(UpdateType.INIT, []);
    render(menuElement, siteMenuComponent);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});

