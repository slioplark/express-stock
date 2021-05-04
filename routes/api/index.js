var express = require('express')
var router = express.Router()

router.use('/line', require('./line'))

module.exports = router
