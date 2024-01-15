const Note = require('./../models/noteModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
//get all Notes
exports.getAllNotes = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Note.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
        ;
    const notes = await features.query;
    res.status(200).json({
        status: 'success',
        results: notes.length,
        data: {
            notes
        }
    });

});
//get Note by id
exports.getNote = catchAsync(async (req, res, next) => {
    const note = await Note.findById(req.params.id);

    if (!note) {
        return next(new AppError('No Note found with that id ', 404));
    }


    res.status(200).json({
        status: 'success',
        data: {
            note
        }
    });
});
//create Note
exports.createNote = catchAsync(async (req, res, next) => {
    const newNote = await Note.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            note: newNote
        }
    });
});
// update Note
exports.updateNote = catchAsync(async (req, res, next) => {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!note) {
        return next(new AppError('No Note found with that id ', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            note
        }
    });
});
// Delete Note
exports.deleteNote = catchAsync(async (req, res,next) => {
    const note = await Note.findByIdAndDelete(req.params.id);
    
    if (!note) {
        return next(new AppError('No tour found with that ID', 404));
      }

    res.status(204).json({
        status: 'success',
        data: null
    });

});
