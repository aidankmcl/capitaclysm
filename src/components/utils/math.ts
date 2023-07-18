
// Credit: https://stackoverflow.com/a/42321673
export const randInRange = (min: number, max: number) => {
  const randomBuffer = new Uint32Array(1);
  window.crypto.getRandomValues(randomBuffer);

  const randomNumber = randomBuffer[0] / (0xffffffff + 1);

  const rand = randomNumber * (max - min) + min;
  if (Number.isInteger(min) && Number.isInteger(max)) return Math.round(rand);

  return rand;
};
