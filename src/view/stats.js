import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {makeItemsUniq, countWayPointsByType, countPriceWaypointsByType, countMinutesWaypointsByType} from '../utils/stats';
import {getParsedDurationFromMinutes} from '../utils/waypoint';

const BAR_HEIGHT = 55;

const renderMoneyChart = (moneyCtx, waypoints,uniqTypes) => {
  const totalSumPriceByType = uniqTypes.map((type) => countPriceWaypointsByType(waypoints, type));

  const sortable = totalSumPriceByType.sort((a, b) => (a.price < b.price) ? 1 : -1);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortable.map((obj) => obj.type.toUpperCase()),
      datasets: [{
        data: sortable.map((obj) => obj.price),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTypeChart = (typeCtx, waypoints, uniqTypes) => {

  const waypointsByTypeCounts = uniqTypes.map((type) => countWayPointsByType(waypoints, type));

  const sortable = waypointsByTypeCounts.sort((a, b) => (a.waypointsCount < b.waypointsCount) ? 1 : -1);

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortable.map((obj) => obj.type.toUpperCase()),
      datasets: [{
        data: sortable.map((obj) => obj.waypointsCount),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTimeSpendChart = (timeSpendCtx, waypoints, uniqTypes) => {

  const minutesByType = uniqTypes.map((type) => countMinutesWaypointsByType(waypoints, type));

  const sortable = minutesByType.sort((a, b) => (a.timeInMinutes < b.timeInMinutes) ? 1 : -1);

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortable.map((obj) => obj.type.toUpperCase()),
      datasets: [{
        data: sortable.map((obj) => obj.timeInMinutes),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${getParsedDurationFromMinutes(val)}`,
        },
      },
      title: {
        display: true,
        text: 'TIME-SPEND',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = () => {
  return `<section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>

          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
        </section>`;
};

export default class Stats extends SmartView {
  constructor(waypoints) {
    super();

    this._data = {
      waypoints,

    };

    this._moneyChart = null;
    this._typeChart = null;
    this._timeSpendChart = null;

    this._dateChangeHandler = this._dateChangeHandler.bind(this);

    this._setCharts();
  }

  removeElement() {
    super.removeElement();
    if (this._moneyChart !== null || this._typeChart !== null || this._timeSpendChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeSpendChart = null;
    }
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  restoreHandlers() {
    this._setCharts();
  }

  _dateChangeHandler([dateFrom, dateTo]) {
    if (!dateFrom || !dateTo) {
      return;
    }

    this.updateData({
      dateFrom,
      dateTo,
    });
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeSpendChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeSpendChart = null;
    }

    const { waypoints } = this._data;
    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeSpendCtx = this.getElement().querySelector('.statistics__chart--time');

    const types = waypoints.map((waypoint) => waypoint.type);
    const uniqTypes = makeItemsUniq(types);


    moneyCtx.height = BAR_HEIGHT * uniqTypes.length;
    typeCtx.height = BAR_HEIGHT * uniqTypes.length;
    timeSpendCtx.height = BAR_HEIGHT * uniqTypes.length;

    this._moneyChart = renderMoneyChart(moneyCtx, waypoints, uniqTypes);
    this._typeChart = renderTypeChart(typeCtx, waypoints, uniqTypes);
    this._timeSpendChart = renderTimeSpendChart(timeSpendCtx, waypoints, uniqTypes);
  }
}
