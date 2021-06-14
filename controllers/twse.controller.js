const axios = require('axios')
const dayjs = require('dayjs')
const { stockRef } = require('../services/db/collections')
const telegramController = require('./telegram.contronller')

const date = dayjs().format('YYYYMMDD')

const echo = (req, res) => {
  res.json({ echo: 'twse' })
}

const getLegalPersonByIndex = async (req, res) => {
  try {
    const chatId = req.body.message.chat.id

    const { data: result } = await axios.get('https://www.twse.com.tw/fund/BFI82U', {
      params: {
        dayDate: date,
        response: 'json',
      },
    })

    if (!result.data) throw new Error()
    const index = result.data.reduce((prev, curr) => {
      prev[curr[0]] = {
        buy: parseInt(curr[1].replace(/,/g, '')),
        sell: parseInt(curr[2].replace(/,/g, '')),
        total: parseInt(curr[3].replace(/,/g, '')),
      }
      return prev
    }, {})

    await sendIndexMessage(chatId, index)
    await stockRef.updateStock({
      id: date,
      index: index,
    })

    res.json(result.data)
  } catch (err) {
    res.json(err.message)
  }
}

const sendIndexMessage = async (chatId, index) => {
  const ibs = index['投信'].total
  const fbs = index['外資及陸資'].total
  const hbs = index['自營商(避險)'].total
  const sbs = index['自營商(自行買賣)'].total
  const text = `${setIndexText(fbs, '外資')}\n${setIndexText(ibs, '投信')}\n${setIndexText(
    sbs,
    '自營商'
  )}\n${setIndexText(hbs, '自營商(避險)')}`

  await telegramController.replyMessage(chatId, text)
}

const setIndexText = (num, name) => {
  return num >= 0
    ? `(＋)${name}: ${(num / 100000000).toFixed(2)}(億)`
    : `(－)${name}: ${(num / 100000000).toFixed(2)}(億)`
}

module.exports = {
  echo,
  getLegalPersonByIndex,
}
