// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Route to display a specific vehicle
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildByInvId)
)


// Intentional 500 error route
router.get("/cause-error", (req, res, next) => {
  next(new Error("🚨 Intentional 500 error triggered for testing purposes"))
})


module.exports = router
