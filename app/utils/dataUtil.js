import * as R from 'ramda';

export const randomIndex = length => {
  const a = R.range(1, length + 1);
  const random = Math.random();
  return R.findIndex(x => random * length < x, a);
};

export const randomItem = array => {
  const length = array.length;
  const index = randomIndex(length);
  return array[index];
};
