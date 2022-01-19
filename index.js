const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')
const cors = require('cors')

const SERVER_PORT = process.env.PORT || 2020
const URL = 'mongodb+srv://trickster:629256qwe@cluster0.hujat.mongodb.net/myPlan'

const app = express()
app.use(cors())


mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

app.use('/graphql', graphqlHTTP({
  graphiql: true,
  schema,
}))


const dbConnection = mongoose.connection
dbConnection.on('error', err => console.log(`Connection error: ${err}`))
dbConnection.once('open', () => console.log(`Connect to DB`))

app.listen(SERVER_PORT, () => console.log(`Server started on ${SERVER_PORT}`))