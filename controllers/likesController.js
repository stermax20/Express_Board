const pool = require('../db');

exports.likePost = async (req, res) => {
    const postId = req.params.postId;

    try {
        await pool.query('UPDATE posts SET likes = likes + 1 WHERE id = ?', [postId]);

        const [[{ likes }]] = await pool.query('SELECT likes FROM posts WHERE id = ?', [postId]);
        res.json({ likes });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).send('Error liking post');
    }
};