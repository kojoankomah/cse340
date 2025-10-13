// *******************************
// ********* model/account-model.js ********
// *********************************

const pool = require("../database/")  // connect to the database
const bcrypt = require("bcryptjs")

/* *****************************
* Register new account
* ***************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
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
      hashedPassword,
    ])

    return result.rows[0]
  } catch (error) {
    console.error("registerAccount error:", error)
    return null
  }
}

/* *****************************
* Get account by email
* ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email]
    )
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Update account info
* ***************************** */
async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname  = $2,
          account_email     = $3
      WHERE account_id = $4
      RETURNING *;
    `
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ])
    return result.rows[0]
  } catch (error) {
    console.error("updateAccount error:", error)
    return null
  }
}

/* *****************************
* Update account password
* ***************************** */
async function updateAccountPassword(account_id, new_password) {
  try {
    const hashedPassword = await bcrypt.hash(new_password, 10)
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *;
    `
    const result = await pool.query(sql, [hashedPassword, account_id])
    return result.rows[0]
  } catch (error) {
    console.error("updateAccountPassword error:", error)
    return null
  }
}

module.exports = {
  registerAccount,
  getAccountByEmail,
  updateAccount,
  updateAccountPassword
}
