// to render to a plain string we need to be sure all the arrays are joined after render
export const joinRecursively = (array) => array.map((child) => {
  if (Array.isArray(child)) {
    return joinRecursively(child);
  }
  return child;
}).join('');

export const makeList = children => children.map(child => `<li>${joinRecursively(child)}</li>`).join('');
