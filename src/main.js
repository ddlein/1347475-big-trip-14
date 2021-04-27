import SiteMenuView from './view/site-menu.js';
import FiltersView from './view/filters.js';
import TripInfoView from './view/trip-info.js';
import {generateRoute} from './mock/route.js';
import {render, RenderPosition} from './utils/render.js';
import TripPresenter from './presenter/trip';
import '../src/mock/route.js';

const POINT_COUNT = 20;

const points = new Array(POINT_COUNT).fill('').map(generateRoute);


const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-body__page-main');
const tripMainElement = headerElement.querySelector('.trip-main');
const menuElement = headerElement.querySelector('.trip-controls__navigation');
const filtersElement = headerElement.querySelector('.trip-controls__filters');
const eventsElement = mainElement.querySelector('.trip-events');


if (points.length > 0) {
  render(tripMainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
}

const tripPresenter = new TripPresenter(eventsElement);

render(menuElement, new SiteMenuView());
render(filtersElement, new FiltersView());

tripPresenter.init(points);

