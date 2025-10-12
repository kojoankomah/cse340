// *******************************8
// ********* routes/inventoryRoute.js ********
// *********************************
// // Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")


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
  next(new Error("Intentional 500 error triggered for testing purposes"))
})


// Management view
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)



// Add Classification View
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Process Classification Form
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)


// Add inventory view
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

router.get(
  "/getInventory/:classification_id",
   utilities.handleErrors(invController.getInventoryJSON))


// Process add inventory form
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Edit inventory view
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory))

router.post(
  "/update/",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Deliver the delete confirmation view
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.buildDeleteConfirm)
)

// Handle the delete operation
router.post(
  "/delete",
  utilities.handleErrors(invController.deleteInventoryItem)
)


module.exports = router
