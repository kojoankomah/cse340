// controllers/contactController.js
const contactModel = require("../models/contact-model")
const utilities = require("../utilities/")

/* ****************************************
 * Show the contact form page
 **************************************** */
async function buildContactForm(req, res) {
  const nav = await utilities.getNav()
  res.render("contact", {
    title: "Contact Us",
    nav,
    errors: null,
    loggedin: res.locals.loggedin,
    accountData: res.locals.accountData
  })
}

/* ****************************************
 * Handle contact form submission
 **************************************** */
async function submitContactForm(req, res) {
  try {
    const { message_name, message_email, message_subject, message_body } = req.body
    const account_id = res.locals.loggedin ? res.locals.accountData.account_id : null

    // Basic validation
    if (!message_name || !message_email || !message_body) {
      req.flash("notice", "Please fill in all required fields.")
      return res.redirect("/contact")
    }

    const result = await contactModel.addMessage(account_id, message_name, message_email, message_subject, message_body)

    if (result) {
      req.flash("notice", "Your message has been sent successfully.")
      res.redirect("/")
    } else {
      req.flash("notice", "Something went wrong. Please try again.")
      res.redirect("/contact")
    }
  } catch (error) {
    console.error("submitContactForm error:", error)
    req.flash("notice", "An error occurred. Please try again later.")
    res.redirect("/contact")
  }
}

module.exports = { buildContactForm, submitContactForm }
