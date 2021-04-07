// import {createAddFormTemplate} from './view/add-form.js';
import {createEditFormTemplate} from './view/edit-form.js';
import {createFiltersTemplate} from './view/filter.js';
import {createMenuTemplate} from './view/menu.js';
import {createRouteTemplate} from './view/route.js';
import {createSortTemplate} from './view/sort.js';
import {createWaypointsTemplate} from './view/waypoint.js';
import {generateRoute} from './mock/route.js';
import '../src/mock/route.js';

// const WAYPOINT_COUNT = 3;
const POINT_COUNT = 20;

let points = new Array(POINT_COUNT).fill().map(generateRoute);

points = points.sort((a, b) => {
  if (a.dateTo > b.dateTo) {return 1;}
  if (a.dateTo < b.dateTo) {return -1;}
  return 0;
});

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-body__page-main');
const tripMainElement = headerElement.querySelector('.trip-main');
const menuElement = headerElement.querySelector('.trip-controls__navigation');
const filtersElement = headerElement.querySelector('.trip-controls__filters');
const eventsElement = mainElement.querySelector('.trip-events');

renderTemplate(tripMainElement, createRouteTemplate(points), 'afterbegin');
renderTemplate(menuElement, createMenuTemplate(), 'beforeend');
renderTemplate(filtersElement, createFiltersTemplate(), 'beforeend');
renderTemplate(eventsElement, createSortTemplate(), 'afterbegin');
// renderTemplate(eventsElement, createAddFormTemplate(points[0]), 'beforeend');

for (let i = 1; i < points.length; i++) {
  renderTemplate(eventsElement, createWaypointsTemplate(points[i]), 'beforeend');
}

const eventsList = document.querySelector('.trip-events__list');
renderTemplate(eventsList, createEditFormTemplate(points[0]), 'afterbegin');

// document.querySelector('.event__favorite-btn').click();
// console.log(document.querySelector('.event__favorite-btn'));


