import User from '../models/Auth.js'
import ErrorResponse from "../utils/errorResponse.js"
// const sendEmail = require("../utils/sendEmail");
import crypto from "crypto"
import _ from 'lodash'
import moment from "moment"

let jwtToken = null;

// @desc    Register user
const register = async (req, res, next) => {
    const { email } = req.body;

    let user = {};
    user = await User.findOne({ email: email })
    if (user) return res.status(400).send({message :'User already register!'})

    try {
        user = new User(_.pick(req.body, ['username', 'email', 'password']));

        if (req.body.role) {
            user.role = req.body.role
        }
        await user.save();
        sendToken(user, 200, res);

    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating a create operation"
        });
    }
};

// @desc    Login user
const login = async (req, res, next) => {

    console.log(req.body)

    const { email, password } = req.body;
    // Check if email and password is provided
    if (!email || !password) {

        return next(new ErrorResponse("Please provide an email and password", 400));
    }

    try {
        // Check that user exists by email
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
           res.status(401).send({message :'Invalid credentials'})
            return next(new ErrorResponse("Invalid credentials", 401));
        }

        // Check that password match
        const isMatch = await user.matchPasswords(password);

        if (user.disabled === true) {
            res.status(401).send({message :'Invalid credentials'})
            return next(new ErrorResponse("User does not exist!", 401));
        }
        if (!isMatch) {
            res.status(401).send({message :'Invalid credentials'})
            return next(new ErrorResponse("Invalid credentials", 401));
        }

        sendToken(user, 200, res);
        await saveInfo(user, 200, res);
    } catch (err) {
        next(err);
    }
};


const forgotPassword = async (req, res, next) => {
    // Send Email to email provided but first check if user exists
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return next(new ErrorResponse("No email could not be sent", 404));
        }

        // Reset Token Gen and add to database hashed (private) version of token
        const resetToken = user.getResetPasswordToken();

        await user.save();

        // Create reset url to email to provided email
        const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`;

        // HTML Message
        const message = `
      <h1>You have requested a password reset</h1>
      <p>Please make a put request to the following link:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message,
            });

            res.status(200).json({ success: true, data: "Email Sent" });
        } catch (err) {

            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return next(new ErrorResponse("Email could not be sent", 500));
        }
    } catch (err) {
        next(err);
    }
};
const resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resetToken)
        .digest("hex");

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return next(new ErrorResponse("Invalid Token", 400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({
            success: true,
            data: "Password Updated Success",
            token: user.getSignedJwtToken(),
        });
    } catch (err) {
        next(err);
    }
}


const sendToken = (user, statusCode, res) => {
    const exp = moment().add(process.env.JWT_EXPIRE,'days').unix()
    const token = user.getSignedJwtToken(exp);
    const { password, ...info } = user._doc;

    const expiryDate = new Date(Number(new Date()) + 31536000000);

    res.cookie('jwt', token, {
        expires: expiryDate,
        // secure:true,
        httpOnly: true,
    }).status(statusCode).json({ success: true, ...info, token });
};

const sendTokenOauth = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const { password, ...info } = user._doc;
    const expires = new Date(Date.now() + process.env.JWT_TOKEN);
    jwtToken = token;

    //res.redirect(302, 'http://localhost:3000/login');
    res.redirect(302, 'https://client-4x8r4.ondigitalocean.app/login');
    //res.redirect(302, 'https://sizishop.xiphersoft.com/login');

};

// exports.getJwt = async (req, res, next) => {
//     return res.status(200).send(jwtToken)
// };
//
// exports.removeJwt = async (req, res, next) => {
//     jwtToken = ''
// };


const saveInfo = async (user, statusCode, res) => {
    const user_id = user._id
    try {
        const userInfo = await UserInfo.create({
            user_id
        });
    } catch (err) {
        res.send(err);
    }

}


//new google login

const GoogleAuth = async (req, res, next) => {
    const profile = req.body.profileObj

    let user = await User.findOne({ email: profile.email });
    if (user){
        if (user.googleId){
            sendToken(user, 200, res);
        }
        else {
            return res.status(400).send('This account can not be logged in by google')
        }

    }else {
        try {
            user = new User({ googleId: profile.googleId, email: profile.email, username: profile.name });
            await user.save();
            sendToken(user, 200, res);

        } catch (err) {
            next(err);
        }
    }
};

export default {
    GoogleAuth,
    register,
    login,
    sendTokenOauth
}