// *******************************
// ********* controller/invController.js ********
// *********************************
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

// Build vehicles by classification
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  const nav = await utilities.getNav()
  const className = data.length > 0 ? data[0].classification_name : "No Vehicles Found"
  res.render("./inventory/classification", {
    title: `${className} vehicles`,
    nav,
    grid,
  })
}

// Build single vehicle detail
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getInventoryByInvId(inv_id)
  const detail = await utilities.buildDetailView(data[0])
  const nav = await utilities.getNav()
  const name = `${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/detail", {
    title: name,
    nav,
    detail,
  })
}

// Management page
invCont.buildManagement = async function (req, res, next) {
  try {
    const classificationList = await invModel.getClassifications()
    const classificationSelect = await utilities.buildClassificationList(classificationList)
    const nav = await utilities.getNav()
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
      errors: null,
      messages: req.flash("notice"),
    })
  } catch (error) {
    console.error("Error building management view:", error)
    next(error)
  }
}



// Add classification view
invCont.buildAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    messages: [],
  })
}

// Process new classification
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "Classification successfully added!")
    res.redirect("/inv/management")
  } else {
    req.flash("error", "Failed to add classification. Please try again.")
    res.redirect("/inv/add-classification")
  }
}

// Add inventory view
invCont.buildAddInventory = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classificationListData = await invModel.getClassifications()
  const classificationList = await utilities.buildClassificationList(classificationListData)
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
    classificationList,
    messages: req.flash("notice").concat(req.flash("error")),
  })
}

// Process new inventory
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
    inv_color,
  } = req.body


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
    res.redirect("/inv/management")
  } else {
    req.flash("error", "Sorry, adding the inventory item failed.")
    res.redirect("/inv/add-inventory")
  }
}

// Return inventory by classification as JSON
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0]?.inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

// Build edit inventory view
invCont.buildEditInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const itemData = await invModel.getInventoryByInvId(inv_id)

    if (!itemData || itemData.length === 0) {
      req.flash("notice", "No inventory item found with that ID.")
      return res.redirect("/inv/")
    }

    const classificationData = await invModel.getClassifications()
    const nav = await utilities.getNav()

    // Pass raw array to EJS and selected ID separately
    res.render("./inventory/edit-inventory", {
      title: `Edit ${itemData[0].inv_make} ${itemData[0].inv_model}`,
      nav,
      classificationList: classificationData,
      selectedClassification: itemData[0].classification_id,
      errors: null,
      messages: req.flash("notice").concat(req.flash("error")),
      ...itemData[0], // spreads inv_make, inv_model, etc.
    })
  } catch (error) {
    console.error("Error building edit inventory view:", error)
    next(error)
  }
}


// Update inventory data
invCont.updateInventory = async function (req, res, next) {
  const nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  try {
    // Fetch current item to preserve image paths
    const oldData = await invModel.getInventoryByInvId(inv_id)
    const oldItem = oldData[0]

  // Keep the existing image paths if none are provided
const image = (typeof inv_image === "string" && inv_image.trim() !== "")
  ? inv_image
  : oldItem.inv_image;

const thumbnail = (typeof inv_thumbnail === "string" && inv_thumbnail.trim() !== "")
  ? inv_thumbnail
  : oldItem.inv_thumbnail;

    // Convert number fields
    const parsedInvId = parseInt(inv_id)
    const parsedClassificationId = parseInt(classification_id)
    const parsedYear = parseInt(inv_year)
    const parsedPrice = parseFloat(inv_price)
    const parsedMiles = parseInt(inv_miles)

    console.log("🧩 Updating with:", {
      inv_id: parsedInvId,
      classification_id: parsedClassificationId,
      inv_price: parsedPrice,
      inv_year: parsedYear,
      inv_miles: parsedMiles
    })

    // Perform update
    const updateResult = await invModel.updateInventory(
      parsedInvId,
      inv_make,
      inv_model,
      inv_description,
      image,
      thumbnail,
      parsedPrice,
      parsedYear,
      parsedMiles,
      inv_color,
      parsedClassificationId
    )

    if (updateResult) {
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", `The ${itemName} was successfully updated.`)
      return res.redirect("/inv/")
    } else {
      throw new Error("Update failed - no rows returned")
    }
  } catch (error) {
    console.error("❌ Error updating inventory:", error)

    const classificationListData = await invModel.getClassifications()
    const classificationList = await utilities.buildClassificationList(classificationListData, classification_id)

    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: null,
      messages: req.flash("notice").concat(req.flash("error")),
      ...req.body,
    })
  }
}



module.exports = invCont
