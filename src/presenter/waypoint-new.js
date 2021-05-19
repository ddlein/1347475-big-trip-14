import { remove, render, RenderPosition } from '../utils/render';
import {UserActions, UpdateType} from '../const';
import WaypointEditView from '../view/waypoint-edit';
import {isEscEvent} from '../utils/common';


export default class WaypointNew {
  constructor(waypointListContainer, changeData) {
    this._waypointListContainer = waypointListContainer;
    this._changeData = changeData;

    this._waypointEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(typesAndOffers, citiesWithPhotosAndDescription) {
    if (this._waypointEditComponent !== null) {
      return;
    }
    this._waypointEditComponent = new WaypointEditView(typesAndOffers, citiesWithPhotosAndDescription);
    this._waypointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._waypointEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    //this._waypointEditComponent.setFormCancelClickHandler(this._handleDeleteClick);

    render(this._waypointListContainer, this._waypointEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._waypointEditComponent === null) {
      return;
    }

    remove(this._waypointEditComponent);
    this._waypointEditComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  setSaving() {
    this._waypointEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  _handleFormSubmit(waypoint) {
    this._changeData(
      UserActions.ADD_WAYPOINT,
      UpdateType.MINOR,
      waypoint,
      //Object.assign({id: nanoid()}, waypoint),
    );

    //this.destroy();
  }

  _handleDeleteClick() {
    console.log('del');
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
