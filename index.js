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

var _query = "SELECT Id, Name, FirstName, LastName, UserRoleId, Alias, Email, Department, EmployeeNumber, ManagerId FROM User WHERE IsActive = true AND Department IN ('DTI - Client Support Center', 'DTI - Client Support Center - CRM', 'DTI - Client Support Center - Billing & Swat', 'DTI - Client Support Center - DMS', 'DTI - Client Support Center - F&I', 'DTI - Client Support Center - RTS') ORDER BY FirstName ASC NULLS LAST";

var SFI_SEI_Report_ID = '00O32000004XJ80';
var RTS_SEI_Report_ID = '00O32000004XJ85';
var DMS_SEI_Report_ID = '00O32000004XJ7q';

var SFI_SEI_Report = conn.analytics.report(SFI_SEI_Report_ID);
var RTS_SEI_Report = conn.analytics.report(RTS_SEI_Report_ID);
var DMS_SEI_Report = conn.analytics.report(DMS_SEI_Report_ID);

var results = [];

var csvFileOut = require('fs').createWriteStream(file_name);

conn.login(un, pw, function(err, res) {
  if (err) { return console.error(err); }

  conn.query(_query)
    .stream() // Convert to Node.js's usual readable stream.
    .pipe(csvFileOut);

  console.log("DONE!!!");

});

// -- -- -- -- --

// conn.login(un, pw, function(err, res) {
//   if (err) { return console.error(err); }

//   conn.query(_query, function(err, res) {
//     if (err) { return console.error(err); }

//     console.log(JSON.stringify(res, null, 3));

//     eval(require('locus'));
//   });
// });

// -- -- -- -- --

// conn.login(un, pw, function(err, res) {
//   if (err) { return console.error(err); }

//   SFI_SEI_Report.execute({ details: true }, function(err, result) {
//     if (err) { return console.error(err); }

//     // console.log(result.reportMetadata);
//     // console.log(result.factMap);
//     // console.log(result.factMap["T!T"]);
//     console.log(result.factMap["T!T"].aggregates);
//     // console.log(result.factMap["T!T"].rows);

//     console.log(JSON.stringify(result.factMap["T!T"].rows, null, 3));

//     eval(require('locus'));
//   });
// });




module.exports = app;