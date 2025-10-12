// *******************************8
// ********* model/account-model.js ********
// *********************************
// Bring in the database connection
const pool = require("../database/")  // connect to the database
const bcrypt = require("bcryptjs")


/* *****************************
* Register new account
* **************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const sql = `
      INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password,
        account_type
      )
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING *;
    `

    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword, // store the hashed version, not plain
    ])

    return result.rows[0]
  } catch (error) {
    console.error("registerAccount error:", error)
    return null
  }
}


/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

module.exports = { registerAccount, getAccountByEmail }
