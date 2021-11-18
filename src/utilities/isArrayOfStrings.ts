export default function isArrayOfString(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((_) => typeof _ === 'string');
}
