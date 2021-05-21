import { getTotalDate, sortByDay } from '../utils/waypoint';
import AbstractView from './abstract';

const COUNT_POINT = 3;


const getTrip = (points) => {
  if (points.length > COUNT_POINT) {
    return `${points[0].destination.name} - ... - ${points[points.length - 1].destination.name}`;
  } else {
    const trip = [];
    points.forEach((point) => {
      if(point.destination !== undefined) {
        trip.push(point.destination.name);
      }
    });
    return trip.join(' - ');
  }
};
const createRouteTemplate = (points) => {
  //console.log(points);
  let sum = 0;
  points.forEach((elem) => {
    sum += elem.basePrice;
    if (elem.offers.length !== 0) {
      elem.offers.forEach((offer) => {
        sum += offer.price;
      });
    }
  });

  points = points.sort(sortByDay);

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
    //console.log(this._points);
    return createRouteTemplate(this._points);
  }
}
