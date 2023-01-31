const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const leaderboard = require("./models/leaderboard");
require('dotenv').config()
const PORT = process.env.PORT || 8000

mongoose.connect(
     process.env.DB_CONNECTION, 
    { useNewUrlParser: true, useUnifiedTopology: true }, 
    () => {console.log("Connected to db!");}
)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MongoDB connection established');
});

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