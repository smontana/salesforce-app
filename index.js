require('dotenv').load();
var express = require('express');
var app = express();
app.locals._ = require('lodash');
var _ = require('lodash');
app.locals.moment = require('moment');
var moment = require('moment');
var async = require('async');

require('locus');

var un = process.env.USER_NAME;
var pw = process.env.PASS;

var unix_time = moment().unix().toString();
var file_name = './tmp/' + unix_time + '-report.csv';

var jsforce = require('jsforce');
var conn = new jsforce.Connection();
var fs = require('fs');

var json2csv = require('json2csv');
var fields = ['solution', 'case_closed_by', 'user_sf_id', 'case_id', 'case_number', 'datetime_opened', 'datetime_closed', 'first_contact_resolution'];

var records = [];

var csvFileOut = require('fs').createWriteStream(file_name);

var SFI_SEI_Metrics_Report_ID = '00O32000004gFoK';
var RTS_SEI_Metrics_Report_ID = '00O32000004gGMM';
var DMS_SEI_Metrics_Report_ID = '00O32000004gGKk';
var CRM_SEI_Metrics_Report_ID = '00O32000004gGO3';

var SFI_SEI_Report = conn.analytics.report(SFI_SEI_Metrics_Report_ID);
var RTS_SEI_Report = conn.analytics.report(RTS_SEI_Metrics_Report_ID);
var DMS_SEI_Report = conn.analytics.report(DMS_SEI_Metrics_Report_ID);
var CRM_SEI_Report = conn.analytics.report(CRM_SEI_Metrics_Report_ID);

async.series([
  function(callback){
    conn.login(un, pw, function(err, res) {
      if (err) { return console.error(err); }

      SFI_SEI_Report.execute({ details: true }, function(err, result) {
        if (err) { return console.error(err); }

        var results = result.factMap["T!T"].rows;

        _.each(results, function(a) {
          _.each(a, function(b) {
            var solution = b[0].label;
            var owner = b[1].label;
            var alias = b[1].value;
            var case_id = b[3].label;
            var case_number = b[4].label;
            var created_date = b[5].label;
            var closed_date = b[6].label;
            var first_contact_resolution = b[7].label;

            if (first_contact_resolution == "true") {
              first_contact_resolution = 1
            } else if (first_contact_resolution == "false") {
              first_contact_resolution = 0
            }

            var record = {
              solution: solution,
              owner: owner,
              user_sf_id: alias,
              case_id: case_id,
              case_number: case_number,
              created_date: created_date,
              closed_date: closed_date,
              first_contact_resolution: first_contact_resolution
            };

            records.push(record);
          });
        });

        console.log("----Report Finished Running----");
        
      });
    });

    callback();
  },

  function(callback){
    json2csv({ data: records, fields: fields }, function(err, csv) {
      if (err) console.log(err);

      console.log(csv);

      fs.writeFile(file_name, csv, function(err) {
        if (err) throw err;

        console.log('file saved');

      });
    });

    callback();
  }
],
// optional callback
function(err, results){
  if (err) { return console.error(err); }
  console.log(JSON.stringify(results, null, 2));
});

module.exports = app;