require('dotenv').config()
const router = require('express').Router()
const lineController = require('../../controllers/line.controller')

router.get('/', lineController.info)

router.post('/webhook', lineController.middleware, lineController.getImage)

module.exports = router
