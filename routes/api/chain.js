require('dotenv').config()
const express = require('express')
const router = require('express').Router()
const { chainController } = require('../../controllers')

router.post('/', express.json(), chainController.echo)
router.post('/webhook', express.json(), chainController.webhook)

module.exports = router
