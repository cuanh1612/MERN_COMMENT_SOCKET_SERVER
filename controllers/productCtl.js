const Products = require('../models/productModel')

const productCtl = {
    getProduct: async (req, res) => {
        try {
            const products = await Products.find()
            res.json({ products })
        } catch (error) {
            return res.status(500).json({ msg: err })
        }
    },

    reviews: async (req, res) => {
        try {
            const { rating } = req.body
            if (rating && rating !== 0) {
                const product = await Products.findById(req.params.id)

                if (!product) return res.status(400).json({ msg: 'Product does not exist.' })

                let num = product.numReviews
                let rate = product.rating

                await Products.findOneAndUpdate({ _id: req.params.id }, {
                    rating: rate + rating,
                    numReviews: num + 1
                })

                console.log(num, rate);


                return res.json({ msg: "Update succeess" })
            }
            res.status(400).json({ msg: "Pleas enter review than 0" })
        } catch (error) {
            res.status(500).json({ msg: "error review" })
        }
    }
}

module.exports = productCtl