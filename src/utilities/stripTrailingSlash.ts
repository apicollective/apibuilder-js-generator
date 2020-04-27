export default function stripTrailingSlash(
  value: string,
): string {
  if (value.endsWith('/')) return value.slice(0, -1);
  return value;
}
