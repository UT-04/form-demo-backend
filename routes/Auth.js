const express = require('express');
const { check } = require('express-validator');

const { isUsernameAvailable, signup } = require('../controllers/Auth');

const router = express.Router();

router.post('/signup',
    [
        check('first_name')
            .not()
            .isEmpty(),
        check('last_name')
            .not()
            .isEmpty(),
        check('username')
            .not()
            .isEmpty(),
        check('email')
            .isEmail(),
        check('password')
            .isLength({ min: 6 })
    ],
    signup
);

router.get('/isUsernameAvailable/:username', isUsernameAvailable);

module.exports = router;