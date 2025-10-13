
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

/* ****************************************
 *  Deliver Update Account View
 * **************************************** */
async function buildUpdateAccount(req, res, next) {
  const account_id = req.params.account_id
  const nav = await utilities.getNav()
  const accountData = res.locals.accountData

  // Ensure the user can only edit their own account
  if (parseInt(account_id) !== parseInt(accountData.account_id)) {
    req.flash("notice", "You are not authorized to update this account.")
    return res.redirect("/account/")
  }

  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    accountData
  })
}


/* ****************************************
 * Process Account Info Update
 **************************************** */
async function updateAccountInfo(req, res, next) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const loggedInAccount = res.locals.accountData
  const nav = await utilities.getNav()

  if (parseInt(account_id) !== parseInt(loggedInAccount.account_id)) {
    req.flash("notice", "You are not authorized to update this account.")
    return res.redirect("/account/")
  }

  // Server-side validation
  let errors = []
  if (!account_firstname) errors.push({ msg: "First name is required." })
  if (!account_lastname) errors.push({ msg: "Last name is required." })
  if (!account_email) errors.push({ msg: "Email is required." })

  if (errors.length > 0) {
    return res.render("account/update", {
      title: "Update Account Information",
      nav,
      messages: req.flash(),
      errors: { accountUpdate: errors, passwordChange: [] },
      accountData: { account_id, account_firstname, account_lastname, account_email }
    })
  }

  try {
    const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)
    if (updateResult) {
      req.flash("notice", "Your account information has been updated successfully.")
      const updatedAccount = { ...loggedInAccount, account_firstname, account_lastname, account_email }
      const payload = {
        account_id: updatedAccount.account_id,
        account_firstname: updatedAccount.account_firstname,
        account_lastname: updatedAccount.account_lastname,
        account_email: updatedAccount.account_email,
        account_type: updatedAccount.account_type
      }

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Account update failed. Please try again.")
      return res.redirect(`/account/update/${account_id}`)
    }
  } catch (error) {
    console.error("Error updating account info:", error)
    req.flash("notice", "An error occurred. Please try again.")
    return res.redirect(`/account/update/${account_id}`)
  }
}


/* ****************************************
 * Process Account Info Update
 **************************************** */
async function updateAccountInfo(req, res, next) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const loggedInAccount = res.locals.accountData
  const nav = await utilities.getNav()

  if (parseInt(account_id) !== parseInt(loggedInAccount.account_id)) {
    req.flash("notice", "You are not authorized to update this account.")
    return res.redirect("/account/")
  }

  try {
    const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)

    if (updateResult) {
      req.flash("notice", "Your account information has been updated successfully.")

      const payload = {
        account_id: updateResult.account_id,
        account_firstname: updateResult.account_firstname,
        account_lastname: updateResult.account_lastname,
        account_email: updateResult.account_email,
        account_type: updateResult.account_type
      }

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 3600 * 1000
      })

      return res.redirect("/account/")
    } else {
      req.flash("notice", "Account update failed. Please try again.")
      return res.redirect(`/account/update/${account_id}`)
    }
  } catch (error) {
    console.error("Error updating account info:", error)
    req.flash("notice", "An error occurred. Please try again.")
    return res.redirect(`/account/update/${account_id}`)
  }
}

/* ****************************************
 * Process Password Change
 **************************************** */
async function updateAccountPassword(req, res, next) {
  const { account_id, account_password } = req.body
  const loggedInAccount = res.locals.accountData
  const nav = await utilities.getNav()

  if (parseInt(account_id) !== parseInt(loggedInAccount.account_id)) {
    req.flash("notice", "You are not authorized to update this account.")
    return res.redirect("/account/")
  }

  if (!account_password || account_password.length < 8) {
    return res.render("account/update", {
      title: "Update Account Information",
      nav,
      messages: req.flash(),
      errors: { accountUpdate: [], passwordChange: [{ msg: "Password must be at least 8 characters." }] },
      accountData: loggedInAccount
    })
  }

  try {
    const updateResult = await accountModel.updateAccountPassword(account_id, account_password)
    if (updateResult) {
      req.flash("notice", "Your password has been updated successfully.")
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Password update failed. Please try again.")
      return res.redirect(`/account/update/${account_id}`)
    }
  } catch (error) {
    console.error("Error updating password:", error)
    req.flash("notice", "An error occurred. Please try again.")
    return res.redirect(`/account/update/${account_id}`)
  }
}


module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  buildAccountManagement,
  accountLogin,
  buildUpdateAccount,
  updateAccountInfo,
  updateAccountPassword
}
