const path = require('path');
const fs = require('fs');
const hbs = require('hbs');
const resource = require('./resource');
const { alphaNumOnly, capitalizeFirstLetter } = require('./utils');

function generate(service) {
  const { resources } = service;
  const clients = [];

  resources.forEach((rSource) => {
    clients.push(resource.createResource(rSource, service.imports));
  });

  const hbsFilePath = path.resolve(__dirname, 'templates/client.hbs');
  const hbsFileContents = fs.readFileSync(hbsFilePath).toString('utf-8');
  const template = hbs.handlebars.compile(hbsFileContents);

  const model = {
    constructorName: alphaNumOnly(capitalizeFirstLetter(service.name)),
    clients,
  };

  return new Promise((resolve) => {
    resolve([{
      name: `${service.name}.js`,
      dir: `app/api/${service.name}`,
      contents: template(model),
    }]);
  });
}

module.exports = {
  generate,
};
