function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toCamelCase(str) {
  const parts = str
    .split(/(-|_)/)
    .filter((p) => p !== '-' && p !== '_');
  const capitalized = parts.map((part, idx) => {
    if (idx > 0) {
      return capitalizeFirstLetter(part);
    }

    return part;
  });

  return capitalized.join('');
}

function alphaNumOnly(str) {
  return str.replace(/[^a-zA-Z0-9]/gi, '');
}

function slug(str) {
  return str
    .replace(/[^a-zA-Z0-9\-_\s]/gi, '')
    .replace(/(\s+|_)/gi, '-')
    .toLowerCase();
}

module.exports = {
  toCamelCase, capitalizeFirstLetter, alphaNumOnly, slug,
};
