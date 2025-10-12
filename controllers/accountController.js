
// *******************************8
// ********* controller/accountController.js ********
// *********************************
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    messages: req.flash(), // always include this
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    messages: req.flash(), // changed from [] to req.flash()
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash("notice", `Congratulations, ${account_firstname}! Your account has been created. Please log in.`)
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      messages: req.flash(),
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed. Please try again.")
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      messages: req.flash(),
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      messages: req.flash(),
      errors: null,
      account_email,
    })
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
      console.log("JWT created successfully:", accessToken)

      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }

      // Flash welcome message and redirect
      req.flash("notice", `Welcome back, ${accountData.account_firstname}!`)
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.") // fixed key
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        messages: req.flash(),
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    console.error("Login error:", error)
    req.flash("notice", "Something went wrong during login. Please try again.")
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      messages: req.flash(),
      errors: null,
      account_email,
    })
  }
}

/* ****************************************
 *  Deliver account management view
 * ************************************ */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    messages: req.flash(), // consistent with other routes
    errors: null,
  })
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  buildAccountManagement,
  accountLogin,
}
