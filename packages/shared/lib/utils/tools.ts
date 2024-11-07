export function splitArray<T>(a: T[], n: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < a.length; i += n) {
    result.push(a.slice(i, i + n));
  }
  return result;
}
