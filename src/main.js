import {createAddFormTemplate} from './view/add-form.js';
import {createEditFormTemplate} from './view/edit-form.js';
import {createFiltersTemplate} from './view/filter.js';
import {createMenuTemplate} from './view/menu.js';
import {createRouteTemplate} from './view/route.js';
import {createSortTemplate} from './view/sort.js';
import {createWaypointsTemplate} from './view/waypoint.js';
import {generateRoute} from './mock/route.js';
import '../src/mock/route.js';

const WAYPOINT_COUNT = 3;

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-body__page-main');
const tripMainElement = headerElement.querySelector('.trip-main');
const menuElement = headerElement.querySelector('.trip-controls__navigation');
const filtersElement = headerElement.querySelector('.trip-controls__filters');
const eventsElement = mainElement.querySelector('.trip-events');

renderTemplate(tripMainElement, createRouteTemplate(), 'afterbegin');
renderTemplate(menuElement, createMenuTemplate(), 'beforeend');
renderTemplate(filtersElement, createFiltersTemplate(), 'beforeend');
renderTemplate(eventsElement, createSortTemplate(), 'afterbegin');
renderTemplate(eventsElement, createAddFormTemplate(), 'beforeend');

for (let i = 0; i < WAYPOINT_COUNT; i++) {
  renderTemplate(eventsElement, createWaypointsTemplate(), 'beforeend');
}

const eventsList = document.querySelector('.trip-events__list');
renderTemplate(eventsList, createEditFormTemplate(), 'beforeend');

const points = [];
for (let i = 0; i < 20; i++) {
  points.push(generateRoute());
}
