const mongoose = require('mongoose')
const Schema = mongoose.Schema

const noteCategory = new Schema({
  userId: String,
  title: String,
  color: String,
})

module.exports = mongoose.model( 'NoteCategory', noteCategory)