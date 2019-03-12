# apibuilder-javascript-generator

![apibuilder-javascript-generator Travis build status badge](https://travis-ci.org/apicollective/apibuilder-js-generator.svg?branch=master)

apibuilder code generators for JavaScript

## Development

To run locally run the following command

```bash
npm run dev:start
```

The server will be running on `http://localhost:7050`

## Routes

`GET /generators` - Lists all of the currently supported generators
`GET /generators/:key` - Returns the details of a specific generator
`POST /invocations/:key` - Takes a service definition and returns the generated files for the generator `key`
