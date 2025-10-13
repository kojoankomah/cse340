// *******************************8
// ********* routes/accountRoute.js ********
// *********************************
// Needed Resources
const regValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
router.get("/", utilities.handleErrors(accountController.buildAccountManagement))

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))


// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process the registration data
router.post(
  "/register",
regValidate.registrationRules(),
regValidate.checkRegData,
  accountController.registerAccount
)

// Update account information view
router.get(
  "/update/:account_id",
  utilities.checkJWTToken,
  utilities.checkLoginStatus,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

// Account Info Update
router.post(
  "/update/:account_id",
  utilities.checkJWTToken,
  utilities.checkLoginStatus,
  utilities.handleErrors(accountController.updateAccountInfo)
)

// Password Change
router.post(
  "/update-password/:account_id",
  utilities.checkJWTToken,
  utilities.checkLoginStatus,
  utilities.handleErrors(accountController.updateAccountPassword)
)

module.exports = router