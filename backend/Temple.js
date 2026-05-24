const mongoose = require("mongoose");

const TempleSchema = new mongoose.Schema({
    name: String,
    city: String,
    deity: String,
    poojaTimings: String,
    specialPooja: String,
    nearbyHotels: Array,
    nearbyRooms: Array
});

module.exports = mongoose.model("Temple", TempleSchema);