const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/AppError');
const sendEmail = require('./../utils/email');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id);

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) return next(new AppError(`Please provide username and password!`, 400));

    const user = await User.findOne({ username }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError(`Incorrect username or password!`, 400));
    }

    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError("You are not logged in", 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);

    const freshUser = await User.findById(decoded.id);

    if (!freshUser) {
        return next(new AppError("The user belonging to this user does no longer exist", 401))
    }

    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError("User recently changed Password", 401));
    }
    req.user = freshUser;

    next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    console.log(req.body.email);
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        console.log("hell");
        return next(new AppError("There is no user with this email address", 404));
    }
    const resetToken = user.createPasswordResetToken();
    console.log(resetToken);
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot Your Password? Submit a PATCH request ith your new Password and Password Confirm to : ${resetUrl}.\n If you didnt forget your passsword please ignore this`;

    try{
        await sendEmail({
            email:user.email,
            subject: 'Your Password reset token(valid for 10 min)',
            message
        })
    
        res.status(200).json({
            status: 'success',
            message:'Token sent to Email'
        })
    }
    catch(err){
        user.passwordResetToken=undefined;
        user.passwordResetExpires=undefined;
        await user.save({validateBeforeSave:false});

        return next(new AppError('There was an error sending the email.Try again Later!',500));
    }
    
});

exports.resetPassword = catchAsync(async (req, res, next) => {


});