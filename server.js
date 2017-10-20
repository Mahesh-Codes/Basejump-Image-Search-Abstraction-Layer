'use strict';
require('./imageSearch.js');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(cors());











