const pool = require('../db');

exports.getPosts = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM posts');
    res.render('posts', { posts: rows });
};

exports.getNewPostForm = (req, res) => {
    const author = req.user ? req.user.username : 'Anonymous';
    res.render('new', { author });
};

exports.createPost = async (req, res) => {
    const { title, content } = req.body;
    const author = req.user ? req.user.username : 'Anonymous';
    const [result] = await pool.query('INSERT INTO posts (title, content, author) VALUES (?, ?, ?)', [title, content, author]);
    res.redirect('/posts');
};

exports.getEditPostForm = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
        res.status(404).send('Post not found');
    } else {
        res.render('edit', { post: rows[0] });
    }
};

exports.updatePost = async (req, res) => {
    const { title, content } = req.body;
    await pool.query('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, req.params.id]);
    res.redirect('/posts');
};

exports.deletePost = async (req, res) => {
    await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.redirect('/posts');
};

exports.getPostDetails = async (req, res) => {
    const postId = req.params.id;
    const [postRows] = await pool.query('SELECT * FROM posts WHERE id = ?', [postId]);

    if (postRows.length === 0) {
        res.status(404).send('Post not found');
    } else {
        const post = postRows[0];
        const [commentRows] = await pool.query('SELECT username, comment, created_at FROM comments WHERE post_id = ?', [postId]);
        const comments = commentRows.map(row => ({
            author: row.username,
            content: row.comment,
            createdAt: row.created_at
        }));
        res.render('post_details', { post, comments });
    }
};