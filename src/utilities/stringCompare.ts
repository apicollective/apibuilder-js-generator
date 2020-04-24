export default function stringCompare(
  s1: string,
  s2: string,
): number {
  if (s1 > s2) return 1;
  if (s1 < s2) return -1;
  return 0;
}
