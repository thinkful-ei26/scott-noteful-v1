'use strict';
const express = require('express');

const morgan = require('morgan');
const notesRouter = require('./router/notes.router');
const { PORT } = require('./config');
const app = express();
console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...


app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('public'));


app.use('/api/notes', notesRouter);

//404 handling middleware - gets here after it tries to get to the other endpoints
app.use(function (req, res, next) { var err = new Error('Not Found');
  err.status = 404; res.status(404).json({ message: 'Not Found' });
  //this sets the status to 404, and makes the .json response the error message
});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });

});

//error handling middleware
//If a runtime error occurs in an Express, it will immediately propagate to the next error handler with the method signature: app.use(function (err, req, res, next) {...}), which is this!
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err //blank?
  });
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
