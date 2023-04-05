export const deepCopy = (obj: object): any => {
  return JSON.parse(JSON.stringify(obj));
};
