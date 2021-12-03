const router = require('express').Router()

const commentCtl = require('../controllers/commentCtl')

router.get('/comments/:id', commentCtl.getComments)

module.exports = router
