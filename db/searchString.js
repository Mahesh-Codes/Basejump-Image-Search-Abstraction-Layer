//create schema and model for mongoose database
var mongoose = require("mongoose");
var schema = mongoose.Schema;
var searchSchema = new schema(
  {
    searchStr: String,
    searchDate: Date
  },
  {
    collection: "imageSearch"
  },
  { timestamps: true }
);

/********
* module is a variable that represents current module and exports is an object 
* that will be exposed as a module. So, whatever you assign to module.exports or exports, 
* will be exposed as a module.
**************/
var searchString = mongoose.model("searchString", searchSchema);
module.exports = searchString;












