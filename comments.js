// Create web server
// Run: node comments.js
// Test: curl -i http://localhost:3000/comments
// Test: curl -i http://localhost:3000/comments/1
// Test: curl -i -X POST -d "title=New Comment&body=This is a new comment" http://localhost:3000/comments
// Test: curl -i -X PUT -d "title=Updated Comment&body=This is an updated comment" http://localhost:3000/comments/1
// Test: curl -i -X DELETE http://localhost:3000/comments/1

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Comment = require('./models/comment');

// Configure app to use bodyParser()
// This will let us get data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000; // Set port

var router = express.Router(); // Get instance of express router

// Middleware to use for all requests
router.use(function(req, res, next) {
  console.log('Something is happening.');
  next(); // Make sure we go to the next routes and don't stop here
});

// Test route to make sure everything is working
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

// Routes for comments
router.route('/comments')
  // Create a comment (accessed at POST http://localhost:3000/api/comments)
  .post(function(req, res) {
    var comment = new Comment(); // Create a new instance of the Comment model
    comment.title = req.body.title; // Set the comment's title (from the request)
    comment.body = req.body.body; // Set the comment's body (from the request)

    // Save the comment and check for errors
    comment.save(function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'Comment created!' });
    });
  })
  // Get all the comments (accessed at GET http://localhost:3000/api/comments)
  .get(function(req, res) {
    Comment.find(function(err, comments) {
      if (err)
        res.send(err);

      res.json(comments);
    });
  });

// Routes for comments by id
router.route('/comments/:comment_id')