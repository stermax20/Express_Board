const express = require('express');
const router = express.Router();
const likesController = require('../controllers/likesController');

router.post('/:postId', likesController.likePost);

module.exports = router;