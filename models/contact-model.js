// models/contact-model.js
const pool = require("../database/")

/* ****************************************
 * Save a new contact form message
 **************************************** */
async function addMessage(account_id, name, email, subject, body) {
  try {
    const sql = `
      INSERT INTO contact_message (account_id, message_name, message_email, message_subject, message_body)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING message_id, message_date;
    `
    const result = await pool.query(sql, [account_id || null, name, email, subject, body])
    return result.rows[0]
  } catch (error) {
    console.error("addMessage error:", error)
    return null
  }
}

/* ****************************************
 * Get all messages (for admin view)
 **************************************** */
async function getAllMessages() {
  try {
    const result = await pool.query(`
      SELECT m.*, a.account_firstname, a.account_lastname
      FROM contact_message m
      LEFT JOIN account a ON m.account_id = a.account_id
      ORDER BY m.message_date DESC;
    `)
    return result.rows
  } catch (error) {
    console.error("getAllMessages error:", error)
    return []
  }
}

module.exports = { addMessage, getAllMessages }
