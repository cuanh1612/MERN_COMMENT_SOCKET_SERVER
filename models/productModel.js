const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    images: Object,
    description: String,
    numReviews: Number,
    rating: Number
})

module.exports = mongoose.model('products', productSchema)