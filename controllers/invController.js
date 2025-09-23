const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

// Existing function
invCont.buildByClassificationId = async function (req, res, next) {

//   throw new Error("Test error: Something went wrong!") // TEMP for testing

  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

// ADD THIS FUNCTION (otherwise it’s undefined!)
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getInventoryByInvId(inv_id) // <- You'll create this next
  const detail = await utilities.buildDetailView(data[0]) // custom HTML builder
  let nav = await utilities.getNav()
  const name = `${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/detail", {
    title: name,
    nav,
    detail,
  })
}

module.exports = invCont
