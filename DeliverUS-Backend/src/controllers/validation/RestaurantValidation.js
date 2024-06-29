import { check } from 'express-validator'
import { checkFileIsImage, checkFileMaxSize } from './FileValidationHelper.js'
import { Restaurant, RestaurantCategory } from '../../models/models.js'
const maxFileSize = 2000000 // around 2Mb

// solucion
const checkDiscountValueIsPresentWhenDiscountCodeIs = async (value, { req }) => {
  try {
    if (req.body.discountCode !== null && value === null) {
      return Promise.reject(new Error('There is not a discount value associated to the present discount code'))
    } else { return Promise.resolve() }
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

// solucion
const checkDiscountCodeIsPresentWhenDiscountValueIs = async (value, { req }) => {
  try {
    if (req.body.discountValue !== null && value === null) {
      return Promise.reject(new Error('There is not a discount code associated to the present discount value'))
    } else { return Promise.resolve() }
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

// solucion
const checkDiscountCodeNotExists = async (value, { req }) => {
  try {
    const restaurants = await Restaurant.findAll(
      {
        attributes: { exclude: ['userId'] },
        where: { userId: req.user.id },
        include: [{
          model: RestaurantCategory,
          as: 'restaurantCategory'
        }]
      })
    let cuenta = 0
    for (const restaurant of restaurants) {
      if (restaurant.name !== req.body.name) { // para que si podamos aplicar el mismo código al restaurante que ya lo tenía
        if (restaurant.discountCode !== null && restaurant.discountCode === value) {
          cuenta += 1
        }
      }
    } if (cuenta > 0) {
      return Promise.reject(new Error(`The discount code ${value} is already being used in other of your restaurants`))
    } else { return Promise.resolve() }
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

const create = [
  check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  // solucion
  check('discountCode').optional({ nullable: true, checkFalsy: true }).isString().isLength({ min: 1, max: 10 }).trim(),
  // solucion
  check('discountCode').custom(checkDiscountCodeIsPresentWhenDiscountValueIs),
  // solucion
  check('discountValue').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1, max: 99 }).toInt(),
  // solucion
  check('discountValue').custom(checkDiscountValueIsPresentWhenDiscountCodeIs),
  // solucion
  check('discountCode').custom(checkDiscountCodeNotExists),

  check('description').optional({ nullable: true, checkFalsy: true }).isString().trim(),
  check('address').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('postalCode').exists().isString().isLength({ min: 1, max: 255 }),
  check('url').optional({ nullable: true, checkFalsy: true }).isString().isURL().trim(),
  check('shippingCosts').exists().isFloat({ min: 0 }).toFloat(),
  check('email').optional({ nullable: true, checkFalsy: true }).isString().isEmail().trim(),
  check('phone').optional({ nullable: true, checkFalsy: true }).isString().isLength({ min: 1, max: 255 }).trim(),
  check('restaurantCategoryId').exists({ checkNull: true }).isInt({ min: 1 }).toInt(),
  check('userId').not().exists(),
  check('heroImage').custom((value, { req }) => {
    return checkFileIsImage(req, 'heroImage')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('heroImage').custom((value, { req }) => {
    return checkFileMaxSize(req, 'heroImage', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
  check('logo').custom((value, { req }) => {
    return checkFileIsImage(req, 'logo')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('logo').custom((value, { req }) => {
    return checkFileMaxSize(req, 'logo', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB')
]
const update = [
  check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  // solucion
  check('discountCode').optional({ nullable: true, checkFalsy: true }).isString().isLength({ min: 1, max: 10 }).trim(),
  // solucion
  check('discountCode').custom(checkDiscountCodeIsPresentWhenDiscountValueIs),
  // solucion
  check('discountValue').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1, max: 99 }).toInt(),
  // solucion
  check('discountValue').custom(checkDiscountValueIsPresentWhenDiscountCodeIs),
  // solucion
  check('discountCode').custom(checkDiscountCodeNotExists),

  check('description').optional({ nullable: true, checkFalsy: true }).isString().trim(),
  check('address').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('postalCode').exists().isString().isLength({ min: 1, max: 255 }),
  check('url').optional({ nullable: true, checkFalsy: true }).isString().isURL().trim(),
  check('shippingCosts').exists().isFloat({ min: 0 }).toFloat(),
  check('email').optional({ nullable: true, checkFalsy: true }).isString().isEmail().trim(),
  check('phone').optional({ nullable: true, checkFalsy: true }).isString().isLength({ min: 1, max: 255 }).trim(),
  check('restaurantCategoryId').exists({ checkNull: true }).isInt({ min: 1 }).toInt(),
  check('userId').not().exists(),
  check('heroImage').custom((value, { req }) => {
    return checkFileIsImage(req, 'heroImage')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('heroImage').custom((value, { req }) => {
    return checkFileMaxSize(req, 'heroImage', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
  check('logo').custom((value, { req }) => {
    return checkFileIsImage(req, 'logo')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('logo').custom((value, { req }) => {
    return checkFileMaxSize(req, 'logo', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB')
]

export { create, update }
