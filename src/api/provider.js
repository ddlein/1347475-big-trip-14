import PointModel from '../model/waypoint';
import {isOnline} from '../utils/common';

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map(PointModel.adaptToServer));
          this._store.setItems(items);
          return points;
        });
    }

    const storeTasks = Object.values(this._store.getItems());

    return Promise.resolve(storeTasks.map(PointModel.adaptToClient));
  }

  updatePoint(task) {
    if (isOnline()) {
      return this._api.updatePoint(task)
        .then((updatedPoint) => {
          this._store.setItem(updatedPoint.id, PointModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }

    this._store.setItem(task.id, PointModel.adaptToServer(Object.assign({}, task)));

    return Promise.resolve(task);
  }

  addPoint(task) {
    if (isOnline()) {
      return this._api.addPoint(task)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, PointModel.adaptToServer(newPoint));
          return newPoint;
        });
    }

    return Promise.reject(new Error('Add point failed'));
  }

  deleteTask(point) {
    if (isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._store.removeItem(point.id));
    }

    return Promise.reject(new Error('Delete point failed'));
  }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._store.getItems());

      return this._api.sync(storePoints)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
