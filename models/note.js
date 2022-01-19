const mongoose = require('mongoose')
const Schema = mongoose.Schema

const noteSchema = new Schema ({
  title: String,
  text: String,
  time: String
})

module.exports = mongoose.model('Notes', noteSchema)