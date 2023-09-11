export function toTitleCase(src: string): string {
  return src
    .split('\\s+')
    .map((word) => word.substring(0, 1).toUpperCase() + word.substring(1))
    .join('\\s+');
}

export function padStart(src: string, length: number): string {
  let spaces = '';
  for (let i = 0; i < length; i++) spaces += ' ';
  return spaces + src;
}

export function padEnd(src: string, length: number): string {
  let ret = src;
  for (let i = 0; i < length; i++) ret += ' ';
  return ret;
}
