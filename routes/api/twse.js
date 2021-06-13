require('dotenv').config()
const express = require('express')
const router = require('express').Router()
const { twseController } = require('../../controllers')

router.get('/', twseController.echo)
router.get('/legalPersonByIndex', express.json(), twseController.getLegalPersonByIndex)

module.exports = router
