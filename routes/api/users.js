const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// To map mongoose db model
const User = require('../../models/User');

// /**
//  * @route   GET api/users
//  * @desc    Test route
//  * @access  Public
//  *
//  */
// router.get('/', (req, res) => res.send('User route'));

/**
 * @route   POST api/users
 * @desc    Register User
 * @access  Public
 *
 */
router.post(
  '/',

  // add validators for the body fields
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please add a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more chars').isLength({
      min: 6,
    }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    // moongoose typically use user.findOne kinda query that returns a promise but we are here trying to achieve that by async await
    try {
      // See if user exists
      // Get users gravater
      // encrypt the password
      // Return the JWT webtoken

      let user = await User.findOne({ email: email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = gravatar.url(email, {
        s: '200', //default size
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });
      //hashing password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //save to db
      await user.save();
      // if we were to use promises then after genSant(10).then(password = hash)
      // the code gets messy

      const payload = {
        user: {
          id: user.id, // originally is _id as saved in mongodb, but mongoose uses abstraction so we can use .id
        },
      };

      jwt.sign(
        payload, //pass payload
        config.get('jwtSecret'), //pass secret from default config file
        { expiresIn: 360000 }, //optional expiration date
        (err, token) => {
          //err handling in the call back function
          if (err) throw err;
          return res.json({ token }); //sending the jwt token back to the caller
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

module.exports = router;
