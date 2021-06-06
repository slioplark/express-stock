require('dotenv').config()
const express = require('express')
const router = require('express').Router()
const { telegramController } = require('../../controllers')

router.post('/webhook', express.json(), telegramController.replyMessage)

module.exports = router
