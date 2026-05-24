const express = require("express");
const router = express.Router();
const Temple = require("../models/Temple");

router.get("/:city", async (req, res) => {

    const city = req.params.city;

    const temples = await Temple.find({
        city: city
    });

    res.json(temples);
});

module.exports = router;