// *******************************
// ********* utilities/inventory-validation.js ********
// *********************************
const utilities = require(".")
const { body, validationResult } = require("express-validator")

/* **************
 * classification rules + check
 * **************/
function classificationRules() {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[A-Za-z]+$/)
      .withMessage(
        "Classification name must contain only letters, no spaces or special characters."
      ),
  ]
}

async function checkClassificationData(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name || "",
      messages: [],
    })
    return
  }
  next()
}

/* **************
 * inventory rules + check
 * **************/
function inventoryRules() {
  return [
    body("classification_id")
      .trim()
      .notEmpty()
      .isInt()
      .withMessage("Please choose a classification."),
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide the make (at least 2 characters)."),
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide the model."),
    body("inv_year")
      .trim()
      .notEmpty()
      .isInt({ min: 1886 })
      .withMessage("Please provide a valid year."),
    body("inv_price")
      .trim()
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price."),
    body("inv_miles")
      .trim()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Please provide mileage (0 or more)."),
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a color."),
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("Please provide a description (at least 10 characters)."),
    body("inv_image").optional({ checkFalsy: true }).trim().escape(),
    body("inv_thumbnail").optional({ checkFalsy: true }).trim().escape(),
  ]
}

async function checkInventoryData(req, res, next) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    inv_miles,
    inv_color,
    inv_description,
    inv_image,
    inv_thumbnail,
  } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(
      classification_id
    )
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: errors.array(),
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_miles,
      inv_color,
      inv_description,
      inv_image,
      inv_thumbnail,
      messages: Object.values(req.flash()).flat(),
    })
    return
  }
  next()
}

/***********************************
 * Check update data and return errors to edit view
 ***********************************/
async function checkUpdateData(req, res, next) {
  const {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    inv_miles,
    inv_color,
    inv_description,
    inv_image,
    inv_thumbnail,
  } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(
      classification_id
    )
    res.render("inventory/edit-inventory", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      errors: errors.array(),
      classificationList,
      inv_id,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_miles,
      inv_color,
      inv_description,
      inv_image,
      inv_thumbnail,
      messages: Object.values(req.flash()).flat(),
    })
    return
  }
  next()
}

module.exports = {
  classificationRules,
  checkClassificationData,
  inventoryRules,
  checkInventoryData,
  checkUpdateData, // 
}
