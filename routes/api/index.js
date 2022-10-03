var express = require('express')
var router = express.Router()

router.use('/line', require('./line'))
router.use('/twse', require('./twse'))
router.use('/fugle', require('./fugle'))
router.use('/stock', require('./stock'))
router.use('/chain', require('./chain'))
router.use('/playwright', require('./playwright'))

module.exports = router
