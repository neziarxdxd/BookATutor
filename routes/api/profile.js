const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// Load validation
const validateProfileInput = require('../../validation/profileValidation');

// @route   GET api/profile/all
// @desc    Get all users' profiles
// @access  Public
router.get('/all', (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                errors.noprofile = 'There are no profiles';
                return res.status(404).json();
            }
            
            res.json(profiles);
        })
        .catch(err => res.status(404).json({ profile: 'There are no profiles', err }));
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
    const errors = {};
  
    Profile.findOne({ handle: req.params.handle })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          res.status(404).json(errors);
        }
  
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  });

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/search/:handle
// @desc    Get profiles by major
router.get('/searchMajor', (req, res) => {
    Profile.find({ major: 'Computer Science'})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile found';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});


// @route   GET api/profile/search/class
// @desc    Get profiles by subject
// @access  Private
router.get('/searchSubject', (req, res) => {
    Profile.find({ classes: 'CS734'})
        .populate('user', ['name', 'avatar', 'email'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile found';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});


// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false}), (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.major) profileFields.major = req.body.major;
    if (req.body.status) profileFields.status = req.body.status;

    // Classes - Split into array
    if (typeof req.body.classes !== 'undefined') profileFields.classes = req.body.classes.split(',').map(el => el.trim());
    if (req.body.bio) profileFields.bio = req.body.bio;

    Profile.findOne({ user: req.user.id }).then(profile => {
        if (profile) {
            // Update profile
            Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            ).then(profile => res.json(profile));
        }
        // Profile not found
        else {
            Profile.findOne({ handle: profileFields.handle }).then(profile => {
                if (profile) {
                    errors.handle = 'That handle already exists';
                    res.status(400).json(errors);
                }

                new Profile(profileFields).save().then(profile => res.json(profile));
            });
        }
    });
});

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }),
    (req, res) => {
      Profile.findOneAndRemove({ user: req.user.id }).then(() => {
        User.findOneAndRemove({ _id: req.user.id }).then(() =>
          res.json({ success: true })
        );
      });
    }
);

// @route   POST api/profile/availability
// @desc    Add availability to profile
// @access  Private
router.post('/availability', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
        const newAvailability = {
            department: req.body.department,
            courseNum: req.body.courseNum,
            availableTime: req.body.availableTime
        };

        profile.availability.unshift(newAvailability);
        profile.save().then(profile => res.json(profile));
    });
});

// @route   DELETE api/profile/availability/:avb_id
// @desc    Delete availability from profile
// @access  Private
router.delete('/availability/:avb_id', passport.authenticate('jwt', { session: false}), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            // Get remove index
            const removeIndex = profile.availability.map(item => item.id).indexOf(req.params.avb_id);

            // Splice out of array
            profile.availability.splice(removeIndex, 1);

            // Save
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
});



module.exports = router;