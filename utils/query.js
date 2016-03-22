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
var sfi_id_lookup_query = "SELECT Name, Id FROM User WHERE Name IN ('Adrian Reyna', 'Anthony Biard', 'Anthony Perez', 'Brittney Lewis', 'Chiffon Johnson', 'Chris Cabay', 'Courtney Luckey', 'David Daughtry', 'Holly Karasinski', 'Jeff Ploski', 'Jennifer Walker', 'Josh Parten', 'Juana Patton', 'Karrie Champion', 'Malcolm Butler', 'Marybeth Lukas', 'Royce Rubio', 'Ryan Pieratt', 'Shawn Hudson', 'Sheila Alcorn', 'Stacee Andrews', 'Steven Doggett', 'Steven Mathies', 'Tina Theus', 'Vicky Bunn', 'William Archer', 'William Davis') ORDER BY FirstName ASC NULLS LAST";
var dms_id_lookup_query = "SELECT Name, Id FROM User WHERE Name IN ('Tyler Sutherland', 'Derek Bruderer', 'James Owens', 'Arawa Metekingi', 'Betty DeSpain', 'WilliamC Dixon', 'Savanah Partridge', 'Shelli Buckner', 'Lyle Pixton', 'Barbara Wheeler', 'Angela Haycock', 'Leysi Santana', 'Alex Garcia', 'Brandon Bayes', 'Rebekah Curvin', 'Jordan Lewis', 'Dulce Olmedo', 'Tren Slaymaker', 'Michael Gayson', 'Chad Keil', 'Sara Angel', 'Mahana Vito', 'Joshua Bell', 'Lynsee Maron', 'Shyanne Jensen', 'Sheila Morales', 'Melanie Merrill', 'Andrew Ford', 'Brandon Podgorski', 'Debbie Lewis', 'Kent Johnson', 'Matt Johnson', 'Michelle Brigman', 'John Holden', 'Jade Alder', 'Robert Bonosconi', 'Sei Fitu', 'Erin Snider', 'Amanda Mietchen', 'Ciara Brenkmann', 'Nicholas Gingras', 'Jason Pullen', 'Hector Velazquez', 'Ryan Taylor', 'Alan Scherbel', 'Laau Tanuvasa', 'Tuilagi MaSun', 'Collette Evans', 'Ren Shore', 'Anthony Hendricks', 'Robin Schmidt', 'Evelyn Kitchen', 'Lara Cavalcante', 'Jason Wiley', 'Larry Bruin', 'Leann McElvain', 'Amie Mangum', 'Terah Alvarez', 'Diana Warner', 'Tisha White', 'Dabid Nevarez', 'Jennifer Gilleland', 'Seth Hunt', 'Summer Black', 'Gianfranco Darelli', 'Michelle Hart', 'Kayla Shelton', 'Mark Reed', 'Shad Allred', 'Nathan Ambrose', 'Lynzie Cook', 'Shaun Stocks', 'Douglas Phillips', 'Jeremy Mallett', 'Dachelle Ruiz', 'Clark Radford', 'Bobi Larson', 'Cody Chavez', 'Kerrilee Spain', 'Jason Pollard', 'Victoria Curtis', 'Donald Shepherd', 'Robert Soper', 'Shelbie Bullock', 'Beau Smith', 'Lindy Kratzer', 'MarcBrandon George', 'Amy Nelson', 'Emilee Larson', 'Jacob Harenberg', 'Collin Loertscher', 'Alex Augustine', 'Nicholas Allen', 'Mark Metekingi', 'Catherine King', 'Nathan Davis', 'Raman Bassaid', 'Neal Anderson', 'Mallorie Mitchell', 'Richard Bowen', 'Brahim Khanchouche', 'Christopher Dunn', 'Thomas Reasor', 'Kristopher Meagan', 'Alisha Stewart', 'Jori Thomas', 'Judy Okutani', 'Victoria Conder', 'Andrew Johnson', 'Virginia Kiholm', 'Christine Morey', 'Ronald Griener') ORDER BY FirstName ASC NULLS LAST";
var rts_id_lookup_query = "SELECT Name, Id FROM User WHERE Name IN ('Nikolas Cordero', 'Arthur Aubin', 'Jeremy Hickman', 'Kenneth Paquette', 'Kyle Mckibben', 'Melissa Malbaurn', 'David Moran', 'Edward Scott', 'Carmine Penza', 'Abby Perkins', 'Jordan Costa', 'Gene Perkins', 'Debbi Sanchez', 'Jennifer Scott', 'Ashley Nazarian', 'Corrin Hallock', 'Margaret Black', 'Cally Hencey', 'Zachary Kemp', 'Stefan Saracovan', 'William Hopkins', 'Benjamin Perez', 'Kaitlin Hammel', 'Jason Hawks', 'Stephen Carrell', 'Kristen Willey', 'Renae Wetzel', 'Lydia Regan', 'Yuleika Smith', 'Chris Papcin', 'Thomas Kramer', 'Desiree Rosado', 'Melissa Mainville', 'Robert Heller', 'Lindsey Condry', 'Eli Cipher', 'Jessica King', 'Mark Crouch', 'Kathleen Diodato', 'Melissa Bouchard', 'Blake McGlynn', 'John Kerr', 'Kimberly Douchette') ORDER BY FirstName ASC NULLS LAST";
var crm_id_lookup_query = "SELECT Name, Id FROM User WHERE Name IN ('Allison Sellers', 'Nnedi Harrison', 'Erin Reynolds', 'Christopher Lakatos', 'Darnell Huey', 'Chassidy Rabon', 'Jackie Vaughn', 'Adam Wright', 'Dorothy Arrington', 'Josh Vaughn', 'Krystal Gonzalez', 'Ashton Reece', 'Vanessa Jackson') ORDER BY FirstName ASC NULLS LAST";


var results = [];

var csvFileOut = require('fs').createWriteStream(file_name);

conn.login(un, pw, function(err, res) {
  if (err) { return console.error(err); }

  conn.query(crm_id_lookup_query)
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

// var SFI_SEI_Report_ID = '00O32000004XJ80';
// var RTS_SEI_Report_ID = '00O32000004XJ85';
// var DMS_SEI_Report_ID = '00O32000004XJ7q';

// var SFI_SEI_Report = conn.analytics.report(SFI_SEI_Report_ID);
// var RTS_SEI_Report = conn.analytics.report(RTS_SEI_Report_ID);
// var DMS_SEI_Report = conn.analytics.report(DMS_SEI_Report_ID);

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