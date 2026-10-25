const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');

const authCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
};

/**
 * @name registerUsercontroller
 * @desc Register a new user, expect username, email, and password in the request body   
 * @access Public
 */


async function registerUsercontroller(req, res) {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({ 
            message: 'Please provide username, email, and password' 
        });
    }

    const isUserAlreadyExists = await UserModel.findOne({ 
        $or: [{ username }, { email }]
    });
    
    if(isUserAlreadyExists) {
        return res.status(400).json({
            message: 'Account already exists with this email address or username'
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    try {
        user = await UserModel.create({
            username,
            email,
            password: hashedPassword
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'An account already exists with this email address or username'
            });
        }
        throw error;
    }

    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })


}

/**
 * @name loginUsercontroller
 * @desc Login a user, expect email and password in the request body   
 * @access Public
 */
async function loginUsercontroller(req, res) {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if(!user) {
        return res.status(400).json({
            message: 'Invalid email or password'
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
        return res.status(400).json({
            message: 'Invalid email or password'
        })
    }

    const token =  jwt.sign(
        {id: user._id,username: user.username},
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    )

    res.cookie('token', token, authCookieOptions)
    res.status(200).json({
        message: 'User logged in successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })


}


/**
 * @name logoutUserController
 * @desc clear token from cookie and add it to blacklist
 * @access Public
 */

async function logoutUserController (req, res) {

    const token = req.cookies.token

    if(token) {
        await tokenBlacklistModel.create({ token });
    }
    res.clearCookie('token', authCookieOptions);

    res.status(200).json({
        message: 'User logged out successfully'
    })
}

/**
 * @name getMeController
 * @desc Get the current user details
 * @access Private
*/

async function getMeController(req, res) {
    const user = await UserModel.findById(req.user.id)

    res.status(200).json({
        message: 'User details fetched successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

module.exports = {
    registerUsercontroller,
    loginUsercontroller,
    logoutUserController,
    getMeController
}