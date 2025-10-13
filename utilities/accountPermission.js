/* ******************************************
 * Middleware to check if user has Employee or Admin privileges
 ******************************************/

require("dotenv").config()

function checkEmployeeOrAdmin(req, res, next) {
  try {
    const account = res.locals.accountData

    if (!account) {
      req.flash("notice", "You must be logged in to access that page.")
      return res.redirect("/account/login")
    }

    const allowed = ["Employee", "Admin"]
    if (allowed.includes(account.account_type)) {
      next() // ✅ allow through
    } else {
      // 🚨 Log unauthorized access attempt
      console.warn(`Unauthorized access attempt by ${account.account_email}`)

      req.flash(
        "notice",
        "Access denied. You do not have permission to view that page."
      )
      return res.redirect("/account/login")
    }
  } catch (error) {
    console.error("Permission check error:", error)
    req.flash("notice", "Authentication error. Please log in again.")
    return res.redirect("/account/login")
  }
}

module.exports = { checkEmployeeOrAdmin }
