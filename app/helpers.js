const fs = require('fs');

const writeNewJson = (req, res, data) => {
  fs.writeFile('app/store.json', data, (err) => {
    if (err) console.log(err);
    res.status(201).send(data);
  });
};


module.exports = { writeNewJson };
