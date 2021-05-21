import WaypointEditView from '../view/waypoint-edit';
import {render, RenderPosition, remove} from '../utils/render';
import {UpdateType, UserActions} from '../const';
import {newPointButtonComponent} from '../main.js';
import {isEscEvent} from '../utils/common';

export default class NewPointPresenter {
  constructor(pointListContainer, changeData) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;

    this._pointEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  setSaving() {
    this._pointEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._pointEditComponent.shake(resetFormState);
  }

  init(typesAndOffers, citiesWithPhotosAndDescription) {
    if (this._pointEditComponent !== null) {
      return;
    }
    this._pointEditComponent = new WaypointEditView(typesAndOffers, citiesWithPhotosAndDescription);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointListContainer, this._pointEditComponent, RenderPosition.AFTERBEGIN);
    this._pointEditComponent.getElement().querySelector('.event__input--destination').focus();
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointEditComponent === null) {
      return;
    }

    remove(this._pointEditComponent);
    this._pointEditComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(waypoint) {
    this._changeData(
      UserActions.ADD_WAYPOINT,
      UpdateType.MINOR,
      waypoint,
    );
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      newPointButtonComponent.removeDisabled();
      this.destroy();
    }
  }
}
