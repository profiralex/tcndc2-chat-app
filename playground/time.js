const moment = require('moment');

// var date = new Date();
// console.log(date.getMonth());

const date = moment();
console.log(date.format('MMM Do, YYYY h:mm:ss A'));

const timestamp = moment().valueOf();
