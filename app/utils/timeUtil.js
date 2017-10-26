export const secondsToTimeObj = secondCount => {
  const totalMins = Math.floor(secondCount / 60);
  const hours = Math.floor(totalMins / 60);
  const minutes = totalMins % 60;
  const seconds = secondCount % 60;
  return {
    hours,
    minutes,
    seconds,
  };
};
export const secondsToTimeStr = secondCount => {
  const { hours = 0, minutes = 0, seconds = 0 } = secondsToTimeObj(secondCount);

  let str = '';
  if (hours) {
    str += `${hours}:`;
  }
  str += `${String(minutes).padStart(2, '0')}:`;
  str += String(seconds).padStart(2, '0');

  return str;
};
