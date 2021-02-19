const express = require('express');
const fs = require('fs');
const app = express();
const helmet = require('helmet');
const lib = require('./middleware');
const helpers = require('./helpers');

const PORT = process.env.PORT || 3000;

const whiskys = express.Router();

app.use('/whiskys', whiskys);

app.use(helmet());

app.use(lib.logResponse);

whiskys.use(lib.logResponse)

app.get('/', (req, res) => {
  res.send('Welcome to the JSON Manipulator. Navigate to \'/whiskys\' to view the current JSON data.');
});

whiskys.get('/', (req, res) => {
  fs.readFile('app/store.json', (err, data) => {

    if (err) console.log(err);

    else console.log(JSON.parse(data));

    res.status(200).send(JSON.parse(data));
  });
});

whiskys.get('/:type', (req, res) => {
  fs.readFile('app/store.json', (err, data) => {
    if (err) console.log(err);

    const parsedData = JSON.parse(data);

    const foundType = Object.keys(parsedData.whiskys).find(type => req.params.type === type);

    if (foundType) res.send(parsedData.whiskys[foundType]);
    else res.status(404).send('That whisky type does not exist.');
  });
});

whiskys.put('/:type', (req, res) => {
  const updatedType = req.query;

  fs.readFile('app/store.json', (err, data) => {
    if (err) console.log(err);

    const parsedData = JSON.parse(data);

    const foundType = Object.keys(parsedData.whiskys).find(type => req.params.type === type);

    if (foundType) {
      const foundName = parsedData.whiskys[foundType].indexOf(updatedType.name);
      if (foundName !== -1) {
        parsedData.whiskys[foundType][foundName] = updatedType.update;

        const stringified = JSON.stringify(parsedData, null, 2);

        return helpers.writeNewJson(req, res, stringified);
      }
      else return res.status(404).send('That whiskey name does not exist');
    }

    else return res.status(404).send('That type of whisky does not exist');

  });
});

whiskys.post('/', (req, res) => {
  const newWhiskey = req.query;
  const validQuery = Object.keys(newWhiskey).includes('type') && Object.keys(newWhiskey).includes('name');

  if (validQuery) {
    fs.readFile('app/store.json', (err, data) => {

      if (err) console.log(err);

      const parsedData = JSON.parse(data);

      if (typeof newWhiskey.name === 'object') parsedData.whiskys[newWhiskey.type] = [...parsedData.whiskys[newWhiskey.type],...newWhiskey.name];

      else if (typeof newWhiskey.name === 'string') parsedData.whiskys[newWhiskey.type] = [...parsedData.whiskys[newWhiskey.type], newWhiskey.name];

      else return res.status(500).send();

      const stringified = JSON.stringify(parsedData, null, 2);

      helpers.writeNewJson(req, res, stringified);
    });
  }
  else res.status(500).send('Not valid parameters');

});

whiskys.delete('/:type', (req, res) => {

  fs.readFile('app/store.json', (err, data) => {
    if (err) console.log(err);

    const parsedData = JSON.parse(data);

    const foundType = Object.keys(parsedData.whiskys).indexOf(req.params.type);

    if (foundType !== -1) parsedData.whiskys[req.params.type].splice(req.query.name, 1);

    else return res.status(404).send('That type of whisky does not exist');

    const stringified = JSON.stringify(parsedData, null, 2);

    helpers.writeNewJson(req, res, stringified);
  });
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
