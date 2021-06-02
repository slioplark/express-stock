require('dotenv').config()
const express = require('express')
const router = require('express').Router()
const lineController = require('../../controllers/line.controller')

router.get('/', lineController.info)

router.post('/webhook', lineController.middleware, lineController.getImage)

router.post('/message', express.json(), lineController.pushMessage)

module.exports = router
