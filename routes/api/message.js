const express = require('express');
const router = express.Router();
const passport = require('passport');


// Load User model
const Message = require('../../models/Message');

// @route   POST api/message
// @desc    Message Tutor
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false}), (req, res) => {
    console.log(req.body)
    res.send(req.body)
});


module.exports = router;