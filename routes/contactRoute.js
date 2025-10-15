const express = require("express")
const router = express.Router()
const contactController = require("../controllers/contactController")
const utilities = require("../utilities/")

router.get("/", utilities.handleErrors(contactController.buildContactForm))
router.post("/submit", utilities.handleErrors(contactController.submitContactForm))

module.exports = router
