export function setStatePromise(that, newState) {
  return new Promise((resolve) => {
    that.setState(newState, () => {
      resolve();
    });
  });
}

export function defVal(value, def) {
  return value === undefined ? def : value;
}

export function getDateStamp(date = new Date()) {
  return date.toString().split(' ').slice(0, 4).join(' ');
}
