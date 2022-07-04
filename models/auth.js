import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from "crypto"

const UserSchema = new mongoose.Schema({
        username: {
            type: String,
            required: [true, 'Please provide a username']
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            //unique: [true, "User alreday exists"],
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide a valid email",
            ]
        },
        password: {
            type: String,
            select: false
        },
        googleId: {
            type: String,
        },
        activeStatus: {
            type: String,
            default: 'inActive'
        },
        profilePic: {
            type: String,
            default: null
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        },
        blog: [],
        disabled: {
            type: Boolean,
            default: false
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        timestamps: true
    }
)

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({
        id: this._id,
        username: this.username,
        email: this.email,
        role: this.role,
        flag: true
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    }, {})
};
UserSchema.methods.resetJwtToken = function () {
    return jwt.sign({
        id: this._id,
        username: this.username,
        email: this.email,
        role: this.role
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE2,
    }, function (err, token) {
        console.log(token);
    });
};
UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token (private key) and save to database
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // Set token expire date
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes

    return resetToken;
};

const Auth = mongoose.model("Auth", UserSchema)

export default Auth