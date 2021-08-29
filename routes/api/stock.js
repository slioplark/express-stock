require('dotenv').config()
const express = require('express')
const router = require('express').Router()
const { stockController } = require('../../controllers')

router.post('/', express.json(), stockController.echo)
router.post('/webhook', express.json(), stockController.webhook)

module.exports = router
