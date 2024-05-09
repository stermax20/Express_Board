const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

router.get('/', postsController.getPosts);

router.get('/new', postsController.getNewPostForm);

router.post('/', postsController.createPost);

router.get('/:id/edit', postsController.getEditPostForm);

router.put('/:id', postsController.updatePost);

router.delete('/:id', postsController.deletePost);

router.get('/:id', postsController.getPostDetails);

module.exports = router;