var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var express = require('express');
var fs = require('fs');
var helmet = require('helmet');
var lib = require('./middleware');
var helpers = require('./helpers');
var app = express();
var PORT = process.env.PORT || 3000;
var whiskys = express.Router();
app.use('/whiskys', whiskys);
app.use(helmet());
app.use(lib.logResponse);
whiskys.use(lib.logResponse);
app.get('/', function (req, res) {
    res.send('Welcome to the JSON Manipulator. Navigate to \'/whiskys\' to view the current JSON data.');
});
whiskys.get('/', function (req, res) {
    fs.readFile('./store.json', function (err, data) {
        console.log('HERE');
        if (err)
            console.log('WHY????', err);
        else
            console.log(JSON.parse(data));
        res.status(200).send(JSON.parse(data));
    });
});
whiskys.get('/:type', function (req, res) {
    fs.readFile('./store.json', function (err, data) {
        if (err)
            console.log(err);
        var parsedData = JSON.parse(data);
        var foundType = Object.keys(parsedData.whiskys).find(function (type) { return req.params.type === type; });
        if (foundType)
            res.send(parsedData.whiskys[foundType]);
        else
            res.status(404).send('That whisky type does not exist.');
    });
});
whiskys.put('/:type', function (req, res) {
    var updatedType = req.query;
    fs.readFile('./store.json', function (err, data) {
        if (err)
            console.log(err);
        var parsedData = JSON.parse(data);
        var foundType = Object.keys(parsedData.whiskys).find(function (type) { return req.params.type === type; });
        if (foundType) {
            var foundName = parsedData.whiskys[foundType].indexOf(updatedType.name);
            if (foundName !== -1) {
                parsedData.whiskys[foundType][foundName] = updatedType.update;
                var stringified = JSON.stringify(parsedData, null, 2);
                return helpers.writeNewJson(req, res, stringified);
            }
            else
                return res.status(404).send('That whiskey name does not exist');
        }
        else
            return res.status(404).send('That type of whisky does not exist');
    });
});
whiskys.post('/', function (req, res) {
    var newWhiskey = req.query;
    var validQuery = Object.keys(newWhiskey).includes('type') && Object.keys(newWhiskey).includes('name');
    if (validQuery) {
        fs.readFile('./store.json', function (err, data) {
            if (err)
                console.log(err);
            var parsedData = JSON.parse(data);
            if (typeof newWhiskey.name === 'object')
                parsedData.whiskys[newWhiskey.type] = __spreadArray(__spreadArray([], parsedData.whiskys[newWhiskey.type]), newWhiskey.name);
            else if (typeof newWhiskey.name === 'string')
                parsedData.whiskys[newWhiskey.type] = __spreadArray(__spreadArray([], parsedData.whiskys[newWhiskey.type]), [newWhiskey.name]);
            else
                return res.status(500).send('Invalid parameters');
            var stringified = JSON.stringify(parsedData, null, 2);
            helpers.writeNewJson(req, res, stringified);
        });
    }
    else
        res.status(500).send('Not valid parameters');
});
whiskys["delete"]('/:type', function (req, res) {
    fs.readFile('./store.json', function (err, data) {
        if (err)
            console.log(err);
        var parsedData = JSON.parse(data);
        var foundType = Object.keys(parsedData.whiskys).indexOf(req.params.type);
        if (foundType !== -1)
            parsedData.whiskys[req.params.type].splice(req.query.name, 1);
        else
            return res.status(404).send('That type of whisky does not exist');
        var stringified = JSON.stringify(parsedData, null, 2);
        helpers.writeNewJson(req, res, stringified);
    });
});
app.listen(PORT, function () { return console.log("listening on port " + PORT); });
