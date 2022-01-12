const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

/**
 * @route   POST api/posts
 * @desc    Create a Post
 * @access  Private
 *
 */

router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      const post = new Post(newPost);

      await post.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

/**
 * @route   GET api/posts
 * @desc    Get all Post
 * @access  Private
 *
 */

router.get('/', auth, async (req, res) => {
  try {
    const post = await Post.find().sort({ date: -1 }); // date -1 sorts recent first otherwise default is jsut date is oldest first
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET api/posts/:id
 * @desc    Get post by a particular post id (not user id, thats diff)
 * @access  Private
 *
 */

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'No Post found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'No Post found' });
    }
    res.status(500).send('Server Error');
  }
});

/**
 * @route   DELETE api/posts/:id
 * @desc    Delete a post
 * @access  Private
 *
 */

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if user owns the post
    // post.user is a post object user id ie a object so to match it to string user id, add toString() method
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    if (!post) {
      return res.status(404).json({ msg: 'No Post found' });
    }

    await post.remove();

    res.json({ msg: 'Post Removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'No Post found' });
    }
    res.status(500).send('Server Error');
  }
});

/**
 * @route   PUT api/posts/like/:id
 * @desc    Like a post
 * @access  Private
 *
 */

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if post is already liked by the user
    // filter through the likes array
    // likes array consists of user ids of users who have liked
    // if the user id is found, filter gives a array of len > 0
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   PUT api/posts/unlike/:id
 * @desc    Unike a post
 * @access  Private
 *
 */

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if post is already liked by the user
    // filter through the likes array
    // likes array consists of user ids of users who have liked
    // if the user id is found, filter gives a array of len > 0
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    //Get remove index
    // console.log(post.likes.map((like) => like.user.toString())); => [ '61de1ac61c6a69bf6dac1836' ]
    // console.log(post.likes.map((like) => like.user));            => [ new ObjectId("61de1ac61c6a69bf6dac1836") ]
    // console.log(post.likes.map((like) => like.id));              => [ '61de29cad9f09cb4f2794e64' ] its the like's id not the user id
    removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST api/posts/comment/:id  (id of the post to comment on)
 * @desc    Comment on a post
 * @access  Private
 *
 */

router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Fetch the user and then fetch the post to be commented on
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

/**
 * @route   DELETE api/posts/comment/:id/:comment_id (id => id of the post, comment_id => id of the comment to be deleted)
 * @desc    Delete a Comment on a post
 * @access  Private
 *
 */

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    // Fetch the post by post id
    const post = await Post.findById(req.params.id);

    // Pull out the comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    //check if user is the owner of the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    //Ger remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
