const express= require('express');
const noteController = require('./../controllers/noteController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.route('/')
.get(authController.protect,noteController.getAllNotes)
.post(noteController.createNote);

router.route('/:id')
.get(noteController.getNote)
.patch(noteController.updateNote)
.delete(noteController.deleteNote);

module.exports = router;