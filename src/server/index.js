const express = require('express');
const { summary } = require('../generators');
const take = require('lodash/take');
const drop = require('lodash/drop');

const app = express();

var port = process.env.APPLICATIN_PORT || 7050;

app.get('/generators', function (req, res) {
  var offset = req.query.offset || 0;
  var limit = req.query.limit || 10;

  res.send(take(drop(summary, offset), limit));
});

app.listen(port, () => console.log(`apibuilder-javascript-generator listening on http://0.0.0.0:${port}`));