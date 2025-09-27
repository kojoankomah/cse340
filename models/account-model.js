// Bring in the database connection
const pool = require("../database/")  // connect to the database

/* *****************************
* Register new account
* **************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING *;
    `
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    console.error("registerAccount error:", error)
    return null
  }
}

module.exports = { registerAccount }
