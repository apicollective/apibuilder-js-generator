export default function shortNameCompare(a, b) {
  if (a.shortName > b.shortName) {
    return 1;
  }
  if (a.shortName < b.shortName) {
    return -1;
  }
  return 0;
}
