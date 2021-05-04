require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const line = require('@line/bot-sdk')
const admin = require('firebase-admin')
const serviceAccount = require('../serviceAccountKey.json')
const puppeteerController = require('./puppeteer.controller')

const {
  DATABASE_URL,
  STORAGE_BUCKET,
  LINE_CHANNEL_SECRET,
  LINE_CHANNEL_ACCESS_TOKEN,
} = process.env

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: DATABASE_URL,
})

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

const getImage = async (req, res, next) => {
  Promise.all(
    req.body.events.map(async (event) => {
      if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null)
      }

      const url = getUrl(event.message.text)
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

      const buffer = await puppeteerController.getScreenshot(url)
      bucketStream.end(buffer)
    })
  )
    .then((result) => res.json(result))
    .catch((err) => res.status(500).end())
}

const getUrl = (text = '') => {
  const id = text.slice(2)
  switch (text[0].toLowerCase() + text[1]) {
    case 'a.':
      return `https://www.wantgoo.com/stock/institutional-investors/foreign/net-buy-sell-rank`
    case 'b.':
      return `https://www.wantgoo.com/stock/institutional-investors/investment-trust/net-buy-sell-rank`
    case 'c.':
      return `https://www.wantgoo.com/stock/institutional-investors/dealer/net-buy-sell-rank`
    case 'o.':
      return `https://invest.cnyes.com/twstock/TWS/${id}`
    case 'h.':
      return `https://invest.cnyes.com/twstock/TWS/${id}/history`
    case 'i.':
      return `https://invest.cnyes.com/twstock/TWS/${id}/holders/institution`
    case 'f.':
      return `https://invest.cnyes.com/twstock/TWS/${id}/finirating`
    case 'd.':
      return `https://invest.cnyes.com/twstock/TWS/${id}/dividend`
    case 'p.':
      return `https://invest.cnyes.com/twstock/TWS/${id}/profile`
    default:
      return null
  }
}

const getFileLink = (bucketName, filePath, token) =>
  `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
    filePath
  )}?alt=media&token=${token}`

module.exports = {
  middleware,
  info,
  echo,
  getImage,
}
