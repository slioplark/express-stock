require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const axios = require('axios')
const admin = require('../services/db')
const playwrightController = require('./playwright.controller.js')

const { TELEGRAM_CHAIN_TOKEN, STORAGE_BUCKET } = process.env

const bucket = admin.storage().bucket()
const domain = 'https://api.telegram.org'

const echo = async (req, res) => {
  try {
    const text = req.body.message.text
    const chatId = req.body.message.chat.id

    await replyMessage(chatId, text)

    res.json(true)
  } catch (err) {
    res.json(err.message)
  }
}

const webhook = async (req, res) => {
  try {
    const text = req.body.message.text
    const chatId = req.body.message.chat.id

    await replyImage(chatId, text)

    res.json(true)
  } catch (err) {
    res.json(err.message)
  }
}

const replyImage = async (chatId, text) => {
  try {
    const { url } = playwrightController.getConfig(text.toLowerCase())
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
      axios.post(`${domain}/bot${TELEGRAM_CHAIN_TOKEN}/sendPhoto`, {
        chat_id: chatId,
        photo: fileLink,
      })
    })

    const buffer = await playwrightController.getScreenshot(url)
    bucketStream.end(buffer)
  } catch (err) {
    throw new Error(err.message)
  }
}

const replyMessage = async (chatId, text) => {
  try {
    await axios.post(`${domain}/bot${TELEGRAM_CHAIN_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: text,
    })
  } catch (err) {
    throw new Error(err)
  }
}

const getFileLink = (bucketName, filePath, token) =>
  `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
    filePath
  )}?alt=media&token=${token}`

module.exports = {
  echo,
  webhook,
  replyImage,
  replyMessage,
}
