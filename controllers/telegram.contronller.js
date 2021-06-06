const axios = require('axios')

const url = 'https://api.telegram.org/bot'
const { TELEGRAM_BOT_TOKEN } = process.env

const replyMessage = (req, res) => {
  const chatId = req.body.message.chat.id
  const message = req.body.message.text
  axios
    .post(`${url}${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: message,
    })
    .then(() => res.json(null))
    .catch(() => res.status(500).end())
}

module.exports = {
  replyMessage,
}
