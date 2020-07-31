const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

// Load validation
const validateMessageInput = require('../../validation/messageValidation');


// Load User model
const Message = require('../../models/Message');

// @route   POST api/message
// @desc    Message Tutor
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false}), (req, res) => {
    const { errors, isValid } = validateMessageInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    
        // Get fields
    const messageFields = {};
    messageFields.senderId = req.user.id; 
    messageFields.receiverId = req.body.receiverId

    if (req.body.email) messageFields.email = req.body.email;
    if (req.body.phone) messageFields.phone = req.body.phone;
    if (req.body.meetup) messageFields.meetup = req.body.meetup;
    if (req.body.time) messageFields.time = req.body.time;
    if (req.body.duration) messageFields.duration = req.body.duration;
    if (req.body.subjects) messageFields.subjects = req.body.subjects;

    new Message(messageFields).save()
        .then(message => res.json({ success: true }));
});


// @route   GET api/message/:userId
// @desc    Get message by user id
// @access  Private
router.get('/:userId', passport.authenticate('jwt', { session: false}), async (req, res) => {
    try {
        const messages = await Message.find({ receiverId: req.params.userId });
        res.json(messages)
    }
    catch (err) {
        res.status(404).json(err);
    }
  });


module.exports = router;