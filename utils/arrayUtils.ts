export default function generateArray<T>(len: number) {
  return [...new Array<T>(len)];
}
