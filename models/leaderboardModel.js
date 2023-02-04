const mongoose = require('mongoose');
const moment = require('moment');
const momentTz = require('moment-timezone');

const leaderboardSchema = new mongoose.Schema({
userName: {
    type: String,
    required: true
},
score: {
    type: Number,
    required: true
},
date: {
    type: String,
    default: function() {
        return momentTz.tz(moment(), 'America/Los_Angeles').format('MM/DD/YYYY h:mm A');
    }
}
})

const LeaderboardModel = mongoose.model('leaderboard', leaderboardSchema, 'Leaderboard');
module.exports = LeaderboardModel;