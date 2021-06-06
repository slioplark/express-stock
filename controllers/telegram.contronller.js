require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const axios = require('axios')
const admin = require('../services/db')
const puppeteerController = require('./puppeteer.controller.js')

const { TELEGRAM_DOMAIN, TELEGRAM_BOT_TOKEN, STORAGE_BUCKET } = process.env

const bucket = admin.storage().bucket()

const echo = (req, res) => {
  try {
    const chatId = req.body.message.chat.id
    const message = req.body.message.text
    axios.post(`${TELEGRAM_DOMAIN}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: message,
    })
    res.json(null)
  } catch (err) {
    res.status(500).end()
  }
}

const replyMessage = async (req, res) => {
  try {
    const chatId = req.body.message.chat.id
    const message = req.body.message.text

    const { url, w, h } = puppeteerController.getConfig(message.toLowerCase())
    if (!url) throw new Error()

    const uuid = uuidv4()
    const fileName = `stock/${new Date().getTime()}.png`
    const bucketFile = bucket.file(fileName)
    const bucketStream = bucketFile.createWriteStream({
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: uuid,
        },
      },
    })

    bucketStream.on('error', (err) => {
      next(err)
    })

    bucketStream.on('finish', async () => {
      const fileLink = getFileLink(STORAGE_BUCKET, fileName, uuid)
      axios.post(`${TELEGRAM_DOMAIN}/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
        chat_id: chatId,
        photo: fileLink,
      })
    })

    const buffer = await puppeteerController.getScreenshot(url, w, h)
    bucketStream.end(buffer)

    res.json(null)
  } catch (err) {
    res.status(500).end()
  }
}

const getFileLink = (bucketName, filePath, token) =>
  `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
    filePath
  )}?alt=media&token=${token}`

module.exports = {
  replyMessage,
}
