const getRelativeParent = (element) => {
  if (!element) {
    return null;
  }

  const position = window
    .getComputedStyle(element)
    .getPropertyValue('position');
  if (position !== 'static') {
    return element;
  }

  return getRelativeParent(element.parentElement);
};

const positionSuggestions = ({ decoratorRect, popover, state, props }) => {
  const relativeParent = getRelativeParent(popover.parentElement);
  const relativeRect = {};

  if (relativeParent) {
    relativeRect.scrollLeft = relativeParent.scrollLeft;
    relativeRect.scrollTop = relativeParent.scrollTop;

    const relativeParentRect = relativeParent.getBoundingClientRect();
    relativeRect.left = decoratorRect.left - relativeParentRect.left;
    relativeRect.top = decoratorRect.top - relativeParentRect.top;
  } else {
    relativeRect.scrollTop =
      window.pageYOffset || document.documentElement.scrollTop;
    relativeRect.scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;

    relativeRect.top = decoratorRect.top;
    relativeRect.left = decoratorRect.left;
  }

  const left = relativeRect.left + relativeRect.scrollLeft;
  const top = relativeRect.top + relativeRect.scrollTop;
  const bottom = window.innerHeight - top;

  let transform;
  let transition;
  if (state.isActive) {
    if (props.suggestions.size > 0) {
      transform = 'scale(1)';
      transition = 'all 0.25s cubic-bezier(.3,1.2,.2,1)';
    } else {
      transform = 'scale(0)';
      transition = 'all 0.35s cubic-bezier(.3,1,.2,1)';
    }
  }

  const style = {
    left: `${left}px`,
    transform,
    transformOrigin: '1em 0%',
    transition,
    display: 'flex',
    zIndex: 9999,
  };

  if (top < window.innerHeight / 2) {
    style.top = `${top}px`;
  } else {
    style.bottom = `${bottom}px`;
    style.flexDirection = 'column-reverse';
  }

  return style;
};

export default positionSuggestions;
