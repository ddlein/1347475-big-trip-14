import Abstract from '../view/abstract';

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const render = (container, child, place = RenderPosition.BEFOREEND) => {
  // if (container instanceof Abstract) {
  //   container = container.getElement();
  // }
  container = container instanceof Abstract ? container.getElement() : container;

  // if (child instanceof Abstract) {
  //   child = child.getElement();
  // }
  child = child instanceof Abstract ? child.getElement() : child;

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const replace = (newChild, oldChild) => {
  // if (oldChild instanceof Abstract) {
  //   oldChild = oldChild.getElement();
  // }
  oldChild = oldChild instanceof Abstract ? oldChild.getElement() : oldChild;

  // if (newChild instanceof Abstract) {
  //   newChild = newChild.getElement();
  // }
  newChild = newChild instanceof Abstract ? newChild.getElement() : newChild;

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};

const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

export { render, createElement, replace, remove, RenderPosition };
