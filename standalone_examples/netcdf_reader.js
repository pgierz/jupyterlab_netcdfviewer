#!/usr/bin/env node
/**
OK, this is my first time using Javascript... it's exciting to learn! Hooray!

Things I'm regularly forgetting:
+ lines need semicolons at the end!
+ I can't just declare things, you need to give it var or const


Dr. Paul Gierz, AWI Bremerhaven
**/

'use strict'

const fs = require('fs');
const NetCDFReader = require('netcdfjs');

var Validator = require('jsonschema').Validator;
var v = new Validator();

// There are some example files that can be downloaded here:
// http://www.unidata.ucar.edu/software/netcdf/examples/files.html

const data = fs.readFileSync('./sresa1b_ncar_ccsm3-example.nc');

var reader = new NetCDFReader(data);

// Ok, now that I know how to run node programs, the rest should be a matter of
// figuring out how to do some basics.

// NOTE: Print stuff with console.log
// console.log("The reader has the following methods (these are called "+"properties".bold()+"in Javascript)");
// console.log(Object.getOwnPropertyNames(reader)); // ['header', 'buffer']
//
// // NOTE: Access attributes (sub-objects? what exactly are these called) with the "."
// // method, just like in python
// //
// // Let's look at the header:
// console.log("Here's the header...");
// console.log(reader.header);
// console.log("...done!");
//
// // Can you look at the variables like in python?
// console.log("Here are the variables...");
// console.log(reader.variables);
// console.log("...done!");

// // Now we want to figure out what the type of the reader.variables is..
// const typeVariables = Object.prototype.toString.call(reader.variables);
// console.log("The type of reader.variables is", typeVariables);
//
// // NOTE: The next bit contains an example of how to loop over an array:
// //
// // How about just one specific variable?
// console.log("Here's are all the names of the specific variables: ");
// for (var i = 0; i < reader.variables.length; i++){
//   console.log(i, reader.variables[i].name);
// }
//
// // NOTE: The reader.variables object is an ARRAY! This means that you can't get
// // a key out of it like you would be able to do with a dictionary in python.
// // Instead, you need to give the actual index number. Let's see if we can
// //
// // actually get down to the array of a specific variable:
//console.log(typeof(reader.variables[0]))
//console.log(reader.variables);

let variable_schema = {
  "id": "/SimpleVariable",
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "dimensions": {"type": "array",
                  "items": { "type": "number"}
                },
    "attributes": {"type": "array",
                   "items": {"type": "object"}},
    "type": {"type": "string"},
    "size": {"type": "number"},
    "offset": {"type": "number"},
    "record": {"type": "boolean"}
  }
}

for (var i = 0; i < reader.variables.length; i++){
  let result = v.validate(reader.variables[0], variable_schema);
  console.log(result.valid)
}



// // That just prints out the tas_attributes
// const tasArray = reader.getDataVariable("tas")
// console.log(tasArray);
