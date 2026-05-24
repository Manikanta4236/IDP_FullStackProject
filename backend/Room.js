const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    name: String,
    city: String,
    price: Number,
    available: Boolean
});

module.exports = mongoose.model("Room", RoomSchema);