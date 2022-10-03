require('dotenv').config()
const router = require('express').Router()
const { playwrightController } = require('../../controllers')

router.get('/', playwrightController.echo)

module.exports = router
