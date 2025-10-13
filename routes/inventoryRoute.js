// *******************************
// ********* routes/inventoryRoute.js ********
// *********************************

// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")
const { checkEmployeeOrAdmin } = require("../utilities/accountPermission")

/* ****************************************
 * Public routes (accessible to everyone)
 **************************************** */

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

/* ****************************************
 * Restricted routes (Employee or Admin only)
 **************************************** */

// Management view
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.checkLoginStatus,
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagement)
) 


// Add Classification View
router.get(
  "/add-classification",
  utilities.checkJWTToken,
  utilities.checkLoginStatus,
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
)

// Process Classification Form
router.post(
  "/add-classification",
  utilities.checkJWTToken,
  utilities.checkLoginStatus,
  checkEmployeeOrAdmin,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Add Inventory View
router.get(
  "/add-inventory",
  utilities.checkJWTToken,
  utilities.checkLoginStatus,
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
)

// Get inventory JSON (still restricted)
router.get(
  "/getInventory/:classification_id",
  utilities.checkJWTToken,
  utilities.checkLoginStatus,
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.getInventoryJSON)
)

// Process Add Inventory Form
router.post(
  "/add-inventory",
  utilities.checkJWTToken,
  utilities.checkLoginStatus,
  checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Edit Inventory View
router.get(
  "/edit/:inv_id",
  utilities.checkJWTToken,
  utilities.checkLoginStatus,
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildEditInventory)
)

// Process Inventory Update
router.post(
  "/update/",
  utilities.checkJWTToken,
  utilities.checkLoginStatus,
  checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Deliver the Delete Confirmation View
router.get(
  "/delete/:inv_id",
  utilities.checkJWTToken,
  utilities.checkLoginStatus,
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteConfirm)
)

// Handle the Delete Operation
router.post(
  "/delete",
  utilities.checkJWTToken,
  utilities.checkLoginStatus,
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventoryItem)
) 

module.exports = router
