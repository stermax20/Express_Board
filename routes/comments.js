const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');

router.post('/:postId', commentsController.addComment);

module.exports = router;