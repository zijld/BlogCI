const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const cleanCache = require('../middlewares/cleanCache');

const Blog = mongoose.model('Blog');

module.exports = app => {
  // GET: a single blog post
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.find({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  // POST: Create a blog post by user
  app.post('/api/blogs', requireLogin, cleanCache, async (req, res) => {
    const { title, content, imageUrl } = req.body;

    const blog = new Blog({
      title,
      content,
      imageUrl,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400);
    }
  });

  // GET: All blogs by user.id
  app.get('/api/blogs', requireLogin, async (req, res) => {
    const blogs = await Blog.find({ _user: req.user.id }).cache({
      key: req.user.id
    });

    res.send(blogs);
  });
};
