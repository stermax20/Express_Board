const express = require('express');
const app = express();

const bodyParserMiddleware = require('./middlewares/bodyParser');
const methodOverrideMiddleware = require('./middlewares/methodOverride');

const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const likeRoutes = require('./routes/likes');
const MainRoutes = require('./routes/index');

app.set('view engine', 'ejs');

app.use(bodyParserMiddleware);
app.use(methodOverrideMiddleware);

app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/likes', likeRoutes);
app.use('/', MainRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});