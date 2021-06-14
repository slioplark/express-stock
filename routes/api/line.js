require('dotenv').config()
const express = require('express')
const router = require('express').Router()
const { lineController } = require('../../controllers')

router.get('/', lineController.info)
router.post('/message', express.json(), lineController.pushMessage)
router.post('/webhook', lineController.middleware, lineController.replyMessage)

module.exports = router
