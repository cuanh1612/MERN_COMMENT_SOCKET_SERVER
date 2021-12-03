const router = require('express').Router()
const productCtl = require('../controllers/productCtl')

router.get('/products', productCtl.getProduct)

router.patch('/products/:id', productCtl.reviews)

module.exports = router