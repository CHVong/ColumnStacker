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

const LeaderboardModel = mongoose.model('leaderboard', leaderboardSchema, 'Leaderboard');
module.exports = LeaderboardModel;