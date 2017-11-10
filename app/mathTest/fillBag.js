const sum = arr => arr.reduce((acc, cur) => acc + cur, 0);

const items = [1, 2, 3, 4, 5, 6, 7];
const bag = 10;

const fillBag = (remaing, items, itemsInBag = [], current = []) => {
  if (items.length == 0) {
    return current;
  }
  const [first, ...rest] = items;
  if (sum([...itemsInBag, first]) === remaing) {
    current.push([...itemsInBag, first]);
  }

  return [
    ...fillBag(remaing - first, rest, [...itemsInBag, first], current),
    ...fillBag(remaing, rest, itemsInBag, current),
  ];
};

console.log(fillBag(bag, items));
console.log(fillBag(2, [1, 1]));
