declare global {
  interface Math {
    mean(...nums: number[]): number;
    sum(...nums: number[]): number;
    sumReduction<T>(elements: T[], f: (value: T) => number): number;
    signedCeil(x: number): number;
    reciprocal(x: number): number;
    within(min: number, max: number, value: number): boolean;
  }
}

Math.reciprocal = function (x: number) {
  if (x < 0 || x > 1) throw new Error(`${x} must be between 0 and 1`);
  return 1 - x;
};

Math.mean = function (...els: number[]): number {
  return Math.sum(...els) / els.length;
};

Math.sum = function (...nums: number[]): number {
  return nums.reduce((total, item) => total + item, 0);
};

Math.sumReduction = function <T>(
  elements: T[],
  f: (value: T) => number
): number {
  return elements.reduce((total, item) => total + f(item), 0);
};

Math.signedCeil = function (x: number): number {
  if (Math.sign(x) == 1) return Math.ceil(x);
  if (Math.sign(x) == -1) return Math.floor(x);
  return x;
};

Math.within = function within(x: number, min: number, max: number): boolean {
  return x >= min && x <= max;
};

export {};
