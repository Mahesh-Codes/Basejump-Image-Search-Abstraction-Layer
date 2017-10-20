"use strict";
// init project
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");

var mongoose = require("mongoose");
var fs = require("fs");
var searchString = require("./db/searchString");

//ser google custom search
var GoogleSearch = require("google-search");
var googleKey = process.env.CSE_API_KEY;
var googleCx = process.env.CSE_ID;

app.use(bodyParser.json());
app.use(cors());

//allow node to find public folder
app.use("/public", express.static(process.cwd() + "/public"));

//mongoosey
var user = process.env.USER;
var pass = process.env.PASS;
mongoose.Promise = global.Promise;
var dbUrl =
  "mongodb://" + user + ":" + pass + "@ds127864.mlab.com:27864/mahesh-fcc"; //mongodb://<dbuser>:<dbpassword>@ds127864.mlab.com:27864/mahesh-fcc
var db = mongoose.connect(dbUrl, { useMongoClient: true });

// route to package.json file
app.route("/_api/package.json").get(function(req, res, next) {
  console.log("requested");
  fs.readFile(__dirname + "/package.json", function(err, data) {
    if (err) return next(err);
    res.type("txt").send(data.toString());
  });
});

/**
function initSearches() {
  db.imageSearch.remove({})
};
**/

app.route("/").get(function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

/******** get Recent Image searches t*******************/
app.get("/recentSearches/", function(req, res, next) {
  searchString.find({}, function(err, searchStrings) {
    var searchJson = {
      SearchTerm: searchStrings.searchStr,
      SearchDate: searchStrings.serachDate
    };
    var results = [];
      searchStrings.forEach(function(result) {
        //console.log(result.searchStr);
        results.push({
          'Search Term': result.searchStr,
          'Search Date': result.searchDate
          });
     
      });
//console.log(results) 
    res.json(results);
  });

});

//get image search using google custome search
app.get("/imageSearch/:search*", function(req, res, next) {
  var searchStr = req.params.search;
  var offset = parseInt(req.query.offset);
  console.log(searchStr, offset);
  //set google permission
  var googleSearch = new GoogleSearch({
    key: process.env.CSE_API_KEY,
    cx: process.env.CSE_ID
  });
  //request JSON
  googleSearch.build(
    {
      q: searchStr,
      num: 10,
      searchType: "image",
      start: offset || 1,
      fileType: "jpg"
    },
    function(error, response) {
      var results = [];
      response.items.forEach(function(result) {
        results.push({
          url: result.link,
          snippet: result.snippet,
          thumbnail: result.image.thumbnailLink,
          context: result.image.contextLink
        });
      });
      var newSearchString = new searchString({
        searchStr: searchStr,
        searchDate: Date()
      });
      console.log(newSearchString);

      newSearchString.save(function(err) {
        if (err) {
          console.log("passed error trap in save = ", newSearchString);
          next(err);
          return;
        }
        console.log("saved and returned = ", newSearchString.searchStr);
        return;
      });

      return res.send(results);
    }
  );
});

//listen to process.env.PORT which is glitch.com
app.listen(process.env.PORT, function() {
  console.log("Node.js listening ...");
});
