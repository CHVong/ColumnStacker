const mongoose = require('mongoose');
const leaderboardSchema = new mongoose.Schema({
userName: {
    type: String,
    required: true
},
score: {
    type: Number,
    required: true
}
})
module.exports = mongoose.model('leaderboard',leaderboardSchema,'Leaderboard');