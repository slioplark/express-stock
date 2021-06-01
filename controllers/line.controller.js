require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const line = require('@line/bot-sdk')
const admin = require('firebase-admin')
const serviceAccount = require('../serviceAccountKey.json')
const puppeteerController = require('./puppeteer.controller')

const { DATABASE_URL, STORAGE_BUCKET, LINE_CHANNEL_SECRET, LINE_CHANNEL_ACCESS_TOKEN } = process.env

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

      const { url, w, h } = getUrl(event.message.text.toLowerCase())
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

      const buffer = await puppeteerController.getScreenshot(url, w, h)
      bucketStream.end(buffer)
    })
  )
    .then((result) => res.json(result))
    .catch((err) => res.status(500).end())
}

const getUrl = (text = '') => {
  const list = text.split('.')
  if (list.length !== 2) return { url: null }

  const key = list[0]
  const num = list[1]
  switch (key) {
    case 'fmc':
      return { url: 'https://moneydj.emega.com.tw/z/ze/zej/zej.djhtm?A=EV000060&B=&C=0' }
    case 'rf':
      return { url: `https://concords.moneydj.com/Z/ZG/ZGK_D.djhtm`, w: 850 }
    case 'ri':
      return { url: `https://concords.moneydj.com/Z/ZG/ZGK_DD.djhtm`, w: 850 }
    case 'rs':
      return { url: `https://concords.moneydj.com/Z/ZG/ZGK_DB.djhtm`, w: 850 }
    case 'rm':
      return { url: `https://concords.moneydj.com/Z/ZG/ZGK_F.djhtm`, w: 850 }
    case 'o':
      return { url: `https://invest.cnyes.com/twstock/TWS/${num}` }
    case 'h':
      return { url: `https://invest.cnyes.com/twstock/TWS/${num}/history` }
    case 'i':
      return { url: `https://invest.cnyes.com/twstock/TWS/${num}/holders/institution` }
    case 'f':
      return { url: `https://invest.cnyes.com/twstock/TWS/${num}/finirating` }
    case 'd':
      return { url: `https://invest.cnyes.com/twstock/TWS/${num}/dividend` }
    case 'p':
      return { url: `https://invest.cnyes.com/twstock/TWS/${num}/profile` }
    default:
      return { url: null }
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
