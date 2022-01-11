const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

/**
 * @route   GET api/auth
 * @desc    Test route
 * @access  Public
 *
 */

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); //to get user object minus the password
    // findById(id) == findById({_id:id})
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST api/auth
 * @desc    Authenticate User and get token
 * @access  Public
 *
 */
router.post(
  '/',

  // add validators for the body fields
  [
    check('email', 'Please add a valid email').isEmail(),
    check('password', 'Please is required').exists(),
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
      // Return the JWT webtoken

      let user = await User.findOne({ email: email });

      if (!user) {
        return res
          .status(400)
          .json({
            errors: [{ msg: 'Invalid Credentials. User doesnt exist' }],
          });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

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
          return res.json({ token }); //sending the jwt token back to the caller via the callback method
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

module.exports = router;
