var express = require('express')
var router = express.Router()

router.use('/line', require('./line'))
router.use('/twse', require('./twse'))
router.use('/fugle', require('./fugle'))
router.use('/telegram', require('./telegram'))

module.exports = router
