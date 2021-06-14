require('dotenv').config()
const axios = require('axios')
const dayjs = require('dayjs')
const { inxRef } = require('../services/db/collections')

const { FUGLE_API_TOKEN } = process.env

const date = dayjs().format('YYYYMMDD')
const domain = 'https://api.fugle.tw'

const echo = (req, res) => {
  res.json({ echo: 'fugle' })
}

const getQuoteByIndex = async (req, res) => {
  try {
    const { data: result } = await axios.get(`${domain}/realtime/v0.2/intraday/quote`, {
      params: {
        symbolId: 'TWSE_SEM_INDEX_1',
        apiToken: FUGLE_API_TOKEN,
      },
    })

    await inxRef.updateInx({
      id: date,
      price: {
        low: result.data.quote.priceLow.price,
        high: result.data.quote.priceHigh.price,
        open: result.data.quote.priceOpen.price,
        close: result.data.quote.trade.price,
      },
    })

    res.json(result)
  } catch (err) {
    res.json(err.message)
  }
}

module.exports = {
  echo,
  getQuoteByIndex,
}
