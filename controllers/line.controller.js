require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const line = require('@line/bot-sdk')
const axios = require('axios')
const admin = require('../services/db')
const { lineRef } = require('../services/db/collections')
const playwrightController = require('./playwright.controller')

const { STORAGE_BUCKET, LINE_CHANNEL_SECRET, LINE_CHANNEL_ACCESS_TOKEN } = process.env

const bucket = admin.storage().bucket()
const config = {
  channelSecret: LINE_CHANNEL_SECRET,
  channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
}

const client = new line.Client(config)
const middleware = line.middleware(config)

const info = (req, res) => {
  res.json({
    channelSecret: config.channelSecret,
    channelAccessToken: config.channelAccessToken,
  })
}

const echo = (req, res) => {
  Promise.all(
    req.body.events.map((event) => {
      if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null)
      }

      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text,
      })
    })
  )
    .then((result) => res.json(result))
    .catch((err) => res.status(500).end())
}

const pushMessage = async (req, res) => {
  try {
    const { message } = req.body
    const { url } = playwrightController.getConfig(message)
    if (!url) throw new Error()

    const userIds = await lineRef.getUserIds()
    if (!userIds.length) throw new Error()

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

    bucketStream.on('finish', () => {
      const fileLink = getFileLink(STORAGE_BUCKET, fileName, uuid)
      axios.post(
        'https://api.line.me/v2/bot/message/multicast',
        {
          to: userIds,
          messages: [
            {
              type: 'image',
              previewImageUrl: fileLink,
              originalContentUrl: fileLink,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer {${LINE_CHANNEL_ACCESS_TOKEN}}`,
          },
        }
      )
    })

    const buffer = await playwrightController.getScreenshot(url)
    bucketStream.end(buffer)

    res.json(null)
  } catch (err) {
    res.json(null)
  }
}

const replyMessage = async (req, res, next) => {
  Promise.all(
    req.body.events.map(async (event) => {
      if (event.type === 'follow') {
        await lineRef.createUserId(event.source.userId)
        return Promise.resolve(null)
      }

      if (event.type === 'unfollow') {
        await lineRef.deleteUserId(event.source.userId)
        return Promise.resolve(null)
      }

      if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null)
      }

      const { url } = playwrightController.getConfig(event.message.text.toLowerCase())
      if (!url) return Promise.resolve(null)

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

      bucketStream.on('finish', () => {
        const fileLink = getFileLink(STORAGE_BUCKET, fileName, uuid)
        return client.replyMessage(event.replyToken, {
          type: 'image',
          previewImageUrl: fileLink,
          originalContentUrl: fileLink,
        })
      })

      const buffer = await playwrightController.getScreenshot(url)
      bucketStream.end(buffer)
    })
  )
    .then((result) => res.json(result))
    .catch((err) => res.status(500).end())
}

const getFileLink = (bucketName, filePath, token) =>
  `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
    filePath
  )}?alt=media&token=${token}`

module.exports = {
  middleware,
  info,
  echo,
  pushMessage,
  replyMessage,
}
