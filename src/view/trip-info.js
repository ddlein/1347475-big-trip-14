import {getTotalDate} from '../utils/waypoint';
import AbstractView from './abstract';

const COUNT_POINT = 3;


const getTrip = (points) => {
  if (points.length > COUNT_POINT) {
    return `${points[0].destination} - ... - ${points[points.length - 1].destination}`;
  } else {
    const trip = [];
    points.forEach((point) => {
      trip.push(point.destination);
    });
    return trip.join(' - ');
  }
};
const createRouteTemplate = (points) => {
  let sum = 0;
  points.forEach((elem) => {
    sum += elem.basePrice;
  });

  const date = getTotalDate(points[0].dateFrom, points[points.length - 1].dateTo);

  const getTripList = getTrip(points);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTripList}</h1>
      <p class="trip-info__dates">${date}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${sum}</span>
    </p>
  </section>`;
};


export default class TripInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createRouteTemplate(this._points);
  }
}
