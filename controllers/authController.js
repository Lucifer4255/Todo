const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('../../utils/appError')
exports.signup = catchAsync(async(req,res,next) => {
    const newUser = await User.create(req.body);

    const token = jwt.sign({id: newUser._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })

    res.status(200).json({
        status: 'success',
        token,
        data:{
            user: newUser
        }
    });
});

exports.login = catchAsync(async(req, res, next) =>{
    const {username,password} = req.body
    if(!username || !password) return next(new AppError('Please provide email and password!',400));

    const token = '';
    res.status(200).json({
        status: 'success',
        token
    })
});