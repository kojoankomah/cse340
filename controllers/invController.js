const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

// Existing function
  invCont.buildByClassificationId = async function (req, res, next) {
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

// Single vehicle detail
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getInventoryByInvId(inv_id)
  const detail = await utilities.buildDetailView(data[0])
  let nav = await utilities.getNav()
  const name = `${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/detail", {
    title: name,
    nav,
    detail,
  })
}

// Management page
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    messages: req.flash("notice").concat(req.flash("error")) // show all
  })
}


// Show add classification view
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    messages: []
  })
}

// Process new classification
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "Classification successfully added!")
    res.redirect("/inv/management")   // redirect instead of render
  } else {
    req.flash("error", "Failed to add classification. Please try again.")
    res.redirect("/inv/add-classification") // redirect back to the form
  }
}



// controllers/invController.js (add these functions into your invCont object)
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
    classificationList,
    classification_id: null,
    inv_make: null,
    inv_model: null,
    inv_year: null,
    inv_price: null,
    inv_miles: null,
    inv_color: null,
    inv_description: null,
    inv_image: '/images/no-image-available.png',
    inv_thumbnail: '/images/no-image-available.png',
    messages: req.flash("notice").concat(req.flash("error"))
  })
}

invCont.addInventory = async function (req, res, next) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body

  // default image paths
  const imagePath = inv_image || '/images/no-image-available.png'
  const thumbPath = inv_thumbnail || '/images/no-image-available.png'

  const regResult = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    imagePath,
    thumbPath,
    inv_price,
    inv_miles,
    inv_color
  )

  if (regResult) {
    req.flash("notice", `The ${inv_make} ${inv_model} was added.`)
    res.redirect("/inv/management")   // go back to management page
  } else {
    req.flash("error", "Sorry, adding the inventory item failed.")
    res.redirect("/inv/add-inventory") // back to add form
  }
}


module.exports = invCont
