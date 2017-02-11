export function setStatePromise(that, newState) {
  return new Promise((resolve) => {
    that.setState(newState, () => {
      resolve()
    })
  })
}

export function defVal(value, def) {
  return value === undefined ? def : value
}