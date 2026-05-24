const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

router.get("/:city", async (req, res) => {

    const rooms = await Room.find({
        city: req.params.city
    });

    res.json(rooms);
});

module.exports = router;