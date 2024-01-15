const crypto = require('crypto');
const {promisify} = require('util');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync')

exports.signup = catchAsync(async(req,res,next) => {
    const newUser = await User.create(req.body);

    res.status(200).json({
        status: 'success',
        data:{
            user: newUser
        }
    });
});