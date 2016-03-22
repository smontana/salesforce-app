require('dotenv').load();
var express = require('express');
var app = express();
app.locals._ = require('lodash');
var _ = require('lodash');
app.locals.moment = require('moment');
var moment = require('moment');

require('locus');

var un = process.env.USER_NAME;
var pw = process.env.PASS;

var unix_time = moment().unix().toString();
var file_name = './tmp/' + unix_time + '-users.csv';

var jsforce = require('jsforce');
var conn = new jsforce.Connection();
var fs = require('fs');

var results = [];

var csvFileOut = require('fs').createWriteStream(file_name);

var SFI_SEI_Metrics_Report_ID = '00O32000004gFoK';
var RTS_SEI_Metrics_Report_ID = '00O32000004gGMM';
var DMS_SEI_Metrics_Report_ID = '00O32000004gGKk';
var CRM_SEI_Metrics_Report_ID = '00O32000004gGO3';

var SFI_SEI_Report = conn.analytics.report(SFI_SEI_Metrics_Report_ID);
var RTS_SEI_Report = conn.analytics.report(RTS_SEI_Metrics_Report_ID);
var DMS_SEI_Report = conn.analytics.report(DMS_SEI_Metrics_Report_ID);
var CRM_SEI_Report = conn.analytics.report(CRM_SEI_Metrics_Report_ID);

conn.login(un, pw, function(err, res) {
  if (err) { return console.error(err); }

  SFI_SEI_Report.execute({ details: true }, function(err, result) {
    if (err) { return console.error(err); }
    console.log(result.reportMetadata);
    console.log(result.factMap);
    console.log(result.factMap["T!T"]);
    console.log(result.factMap["T!T"].aggregates);
    console.log(result.factMap["T!T"].rows); // <= detail rows in array
    // .stream()
    // .pipe(csvFileOut);
  });

  console.log("DONE!!!");

});

module.exports = app;