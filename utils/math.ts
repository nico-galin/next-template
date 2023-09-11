export function reciprocal(x: number): number {
  if (x < 0 || x > 1) throw new Error(`${x} must be between 0 and 1`);
  return 1 - x;
}

export function mean(...els: number[]): number {
  return sum(...els) / els.length;
}

export function sum(...nums: number[]): number {
  return nums.reduce((total, item) => total + item, 0);
}

export function isWithin(x: number, min: number, max: number): boolean {
  return x >= min && x <= max;
}
