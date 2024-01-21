const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username must be mentioned"],
        unique: true,
        trim: true,
        maxlength: [10, "A username must be less than 10 characters"],
        minlength: [4, "The minimum length of a username must be 4"]
    },
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please tell us your email address'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please tell us your password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (el) {
                return el == this.password;
            },
            message: "password does not match"
        }
    }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;

});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return bcrypt.compare(candidatePassword,userPassword);
}

const User = mongoose.model('User', userSchema);
module.exports = User;