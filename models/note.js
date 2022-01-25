const mongoose = require('mongoose')
const Schema = mongoose.Schema

const noteSchema = new Schema ({
  userId: String,
  title: String,
  text: String,
  time: String,
  day: String,
  startTime: String,
  endTime: String,
  color: String,
})

module.exports = mongoose.model('Notes', noteSchema)