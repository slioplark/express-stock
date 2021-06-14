require('dotenv').config()
const express = require('express')
const router = require('express').Router()
const { fugleController } = require('../../controllers')

router.get('/', fugleController.echo)
router.get('/quoteByIndex', express.json(), fugleController.getQuoteByIndex)

module.exports = router
