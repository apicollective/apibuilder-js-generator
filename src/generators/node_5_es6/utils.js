function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
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
  capitalizeFirstLetter,
  alphaNumOnly,
  slug,
};
