const express = require('express')
const app = express()
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()
const PORT = process.env.PORT || 8000

let db,
    dbConnectionString = process.env.DB_STRING,
    dbName = 'leaderboard',
    collection

MongoClient.connect(dbConnectionString)
    .then(client => {
        console.log(`Connected to Database`)
        db = client.db(dbName)
        collection = db.collection('Leaderboard')
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

app.get('/', async (request, response) => {
    try {
        response.render('index.ejs')
    } catch (error) {
        response.status(500).send({message: error.message})
    }
})


//PORT = 8050
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})