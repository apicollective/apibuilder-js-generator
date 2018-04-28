function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function alphaNumOnly(string) {
  return string.replace(/[^a-zA-Z0-9]/gi, '');
}

module.exports = {
  capitalizeFirstLetter,
  alphaNumOnly,
};
