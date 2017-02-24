import Fuse from 'fuse.js'

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

const fuseOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    {
      name: 'name',
      weight: 0.8,
    },
    {
      name: 'content',
      weight: 0.2
    },
  ],
}

export function fuseSort(list, query) {
  return new Fuse(list, fuseOptions).search(query)
}