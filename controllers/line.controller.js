require('dotenv').config()
const line = require('@line/bot-sdk')

const {
  LINE_CHANNEL_SECRET,
  LINE_CHANNEL_ACCESS_TOKEN
} = process.env

const config = {
  channelSecret: LINE_CHANNEL_SECRET,
  channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN
}

const client = new line.Client(config)
const middleware = line.middleware(config)

const info = (req, res) => {
  res.json({
    channelSecret: config.channelSecret,
    channelAccessToken: config.channelAccessToken
  })
}

const echo = (req, res) => {
  Promise
    .all(req.body.events.map((event) => {
      if (
        event.type !== 'message' ||
        event.message.type !== 'text') {
        return Promise.resolve(null)
      }

      return client.replyMessage(
        event.replyToken, {
        type: 'text',
        text: event.message.text
      });
    }))
    .then((result) => res.json(result))
    .catch((err) => res.status(500).end())
}

module.exports = { middleware, info, echo }