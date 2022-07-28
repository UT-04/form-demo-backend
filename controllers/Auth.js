const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require("../util/HttpError");
const User = require('../models/User');

const signup = async (req, res, next) => {
    try {
        // If inputs are invalid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpError('Invalid inputs passed, please check your data.', 406);
        }

        // Extracting data from req body
        const { user_type, first_name, last_name, username, email, password } = req.body;

        // Searching any existing user with same Email
        const existingUser = await User.findOne({ email: email });

        // If user already exists
        if (existingUser) {
            throw new HttpError('User already exists, Please login instead', 406);
        }

        // Else => Hashing the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Creating new User
        const newUser = new User({
            user_type: user_type,
            first_name: first_name,
            last_name: last_name,
            username: username,
            email: email,
            password: hashedPassword,
        });

        // Saving new user in DB
        await newUser.save();

        // Generating token
        const token = jwt.sign(
            { userId: newUser._id },
            `${process.env.SECRET_TOKEN}`
        );

        // sending new user creation status response
        res
            .status(201)
            .json({
                token: token,
                userId: newUser._id,
            })
    } catch (err) {
        if (err instanceof HttpError)
            next(err);
        else {
            console.log(err);
            next(new HttpError());
        }
    }
}

const isUsernameAvailable = async (req, res, next) => {
    try {
        const { username } = req.params;

        const existingUser = await User.findOne({ username: username });

        if (existingUser)
            throw new HttpError('username is already taken', 401);

        return res.json({
            isUsernameAvailable: true
        })
    } catch (err) {
        if (err instanceof HttpError)
            next(err);
        else {
            console.log(err);
            next(new HttpError());
        }
    }
}

module.exports = {
    signup,
    isUsernameAvailable
}