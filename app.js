const fs = require("fs");
const express = require("express");
var app = express();


// Server location
const hostname = "127.0.0.1";
const port = 3000;

// These are the main stats of the users of the site

var totalHeight = 0;
var totalHeightUsers = 0;

var totalWeight = 0;
var totalWeightUsers = 0;

var totalAge = 0;
var totalAgeUsers = 0;

// Server creation
app.listen(port, hostname, () => {
    console.log("Server running!");
});

// The home page of the site which also is responsible for serving the initial html
app.get("/", function(req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    fs.createReadStream("index.html").pipe(res);
});

// Height only submission route
app.get('/height/:height', function(req, res) {
    var thisHeight = parseInt(req.params.height);
    totalHeight = totalHeight + thisHeight;
    totalHeightUsers = totalHeightUsers + 1;
    res.json({ "height" : thisHeight });
});

// Weight only submission route
app.get('/weight/:weight', function(req, res) {
    var thisWeight = parseInt(req.params.weight);
    totalWeight = totalWeight + thisWeight;
    totalWeightUsers = totalWeightUsers + 1;
    res.json({ "weight" : thisWeight });
});

// Age only submission route
app.get('/age/:age', function(req, res) {
    var thisAge = parseInt(req.params.age);
    totalAge = totalAge + thisAge;
    totalAgeUsers = totalAgeUsers + 1;
    res.json({ "age" : thisAge });
});

// Route for submitting all site user data
app.get('/allStats/:height/:weight/:age', function(req, res) {
    var thisHeight = parseInt(req.params.height);
    var thisWeight = parseInt(req.params.weight);
    var thisAge = parseInt(req.params.age);

    totalHeight = totalHeight + thisHeight;
    totalHeightUsers = totalHeightUsers + 1;

    totalWeight = totalWeight + thisWeight;
    totalWeightUsers = totalWeightUsers + 1;

    totalAge = totalAge + thisAge;
    totalAgeUsers = totalAgeUsers + 1;

    res.json({ "height" : thisHeight, "weight" : thisWeight, "age" : thisAge });
});

// Route to update/retrieve the live site user information from the server
app.get("/updateInfo/", function(req, res) {
    var avgHeight = totalHeight / totalHeightUsers;
    var avgWeight = totalWeight / totalWeightUsers;
    var avgAge = totalAge / totalAgeUsers;
    res.json({ "avgHeight" : avgHeight, "avgWeight" : avgWeight,  "avgAge" : avgAge });
});

// Route for stat comparison which gives the necessary information from server and does some of the calculation
app.get('/compare/:height/:weight/:age', function(req, res) {
    var thisHeight = parseInt(req.params.height);
    var thisWeight = parseInt(req.params.weight);
    var thisAge = parseInt(req.params.age);

    var heightDiff = thisHeight - (totalHeight / totalHeightUsers);
    var weightDiff = thisWeight - (totalWeight / totalWeightUsers);
    var ageDiff = thisAge - (totalAge / totalAgeUsers);

    var avgHeight = totalHeight / totalHeightUsers;
    var avgWeight = totalWeight / totalWeightUsers;
    var avgAge = totalAge / totalAgeUsers;

    res.json({ "avgHeight" : avgHeight, "avgWeight" : avgWeight,  "avgAge" : avgAge, 
        "heightDiff" : heightDiff, "weightDiff" : weightDiff, "ageDiff" : ageDiff });

});

// Route to generating a rating for a user based on their stats
app.get('/rating/:height/:weight/:age/', function(req, res) {
    var thisHeight = parseInt(req.params.height);
    var thisWeight = parseInt(req.params.weight);
    var thisAge = parseInt(req.params.age);

    var rating = Math.floor((thisWeight * thisHeight) / thisAge);

    res.json({ "rating" : rating });
});