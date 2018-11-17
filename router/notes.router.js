'use strict';
const express = require('express');
const router = express.Router();


const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;

  notes.filter(searchTerm)
    .then(list => res.json(list))
    .catch(err => next(err));


  // notes.filter(searchTerm, (err, list) => {
  //   if (err) {
  //     return next(err); // goes to error handler
  //   }
  //   res.json(list); // responds with filtered array
  // });
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  notes.find(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});




// notes.find(id, (err, list) => {
//   if (err) {
//     return next(err); // goes to error handler
//   }
//   res.json(list); // responds with filtered array
// });
//});

router.put('/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];



  updateFields.forEach(field => {

    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.update(id, updateObj)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => next(err));
  //   if (err) {
  //     return next(err);
  //   }
  //   if (item) {
  //     res.json(item);
  //   } else {
  //     next();
  //   }
  // });
});

// Post (insert) an item
router.post('/', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem) //, (err, item) => {
    .then(item => {
      if (item) {
        res.location(`http://${req.headers.host}/api/notes/${item.id}`)
          .status(201).json(item);
      } else {
        next();
      }
    })
    .catch(err => next(err));


  //   if (err) {
  //     return next(err);
  //   }
  //   if (item) {
  //     res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
  //   } else {
  //     next();
  //   }
  // });
});

router.delete('/:id', (req, res, next) => {
  const id = Number(req.params.id);

  notes.delete(id) //, (err, list) => {
    .then(item => {
      if (item) {
        res.status(204).end();
      }
    })
    .catch(err => next(err));


  //   if (err) {
  //     return next(err); // goes to error handler
  //   }
  //   res.status(204).end();
  // });
});


router.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

router.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = router;
