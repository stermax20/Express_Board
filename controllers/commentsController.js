const pool = require('../db');

exports.addComment = async (req, res) => {
    const postId = req.params.postId;
    const { comment } = req.body;
    const author = req.user ? req.user.username : 'Anonymous';

    try {
        await pool.query('UPDATE posts SET comments = comments + 1 WHERE id = ?', [postId]);
        await pool.query('INSERT INTO comments (post_id, comment, author) VALUES (?, ?, ?)', [postId, comment, author]);
        await resetCommentIdIfNecessary();
        res.redirect(`/posts/${postId}`);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).send('Error adding comment');
    }
};

exports.updateComment = async (req, res) => {
    const commentId = req.params.commentId;
    const { comment } = req.body;

    try {
        await pool.query('UPDATE comments SET comment = ? WHERE id = ?', [comment, commentId]);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).send('Error updating comment');
    }
};

exports.deleteComment = async (req, res) => {
    const commentId = req.params.commentId;

    try {
        const [result] = await pool.query('DELETE FROM comments WHERE id = ?', [commentId]);
        if (result.affectedRows > 0) {
            await resetCommentIdIfNecessary();
            res.sendStatus(200);
        } else {
            res.status(404).send('Comment not found');
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).send('Error deleting comment');
    }
};

exports.addReply = async (req, res) => {
    const commentId = req.params.commentId;
    const { reply } = req.body;

    try {
        await pool.query('INSERT INTO replies (comment_id, reply) VALUES (?, ?)', [commentId, reply]);
        await pool.query('ALTER TABLE replies AUTO_INCREMENT = 1');
        res.sendStatus(200);
    } catch (error) {
        console.error('Error adding reply:', error);
        res.status(500).send('Error adding reply');
    }
};

exports.getPostDetails = async (req, res) => {
    const postId = req.params.id;
    const [postRows] = await pool.query('SELECT * FROM posts WHERE id = ?', [postId]);

    if (postRows.length === 0) {
        res.status(404).send('Post not found');
    } else {
        const post = postRows[0];
        const [commentRows] = await pool.query('SELECT c.id, c.author, c.comment, c.created_at FROM comments c WHERE c.post_id = ?', [postId]);

        const comments = await Promise.all(commentRows.map(async row => {
            const [replyRows] = await pool.query('SELECT reply, created_at FROM replies WHERE comment_id = ?', [row.id]);
            const replies = replyRows.map(replyRow => ({ content: replyRow.reply, createdAt: replyRow.created_at }));

            return {
                id: row.id,
                author: row.author,
                content: row.comment,
                createdAt: row.created_at,
                replies
            };
        }));

        res.render('post_details', { post, comments });
    }
};

const resetCommentIdIfNecessary = async () => {
    const [commentCount] = await pool.query('SELECT COUNT(*) AS count FROM comments');
    if (commentCount[0].count === 0) {
    } else if (commentCount[0].count === 1) {
        await pool.query('UPDATE comments SET id = 1');
    } else {
        await pool.query('SET @count = 0');
        await pool.query('UPDATE comments SET id = @count:= @count + 1');
    }
};