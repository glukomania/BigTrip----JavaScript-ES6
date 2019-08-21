// utility module

const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

// gets all html parts together
const getMarkup = (dataList, generator) =>
  dataList.map(generator).join(`\n`);

// adds a new element to dom
const addSection = (container, template, place) =>
  container.insertAdjacentHTML(place, template);

// insert a new block inside an existing selector
const insertSection = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

// creates an element and puts it to the dom
const createElement = (template, selector = `div`, classNames) => {
  const newElement = document.createElement(selector);
  if (classNames) {
    for (let item of classNames) {
      newElement.classList.add(item);
    }
  }
  newElement.innerHTML = template;
  return newElement;
};

export {
  addSection,
  getMarkup,
  Position,
  insertSection,
  createElement
};
