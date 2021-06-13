const axios = require('axios')
const dayjs = require('dayjs')
const { stockRef } = require('../services/db/collections')

const date = dayjs().format('YYYYMMDD')

const echo = (req, res) => {
  res.json({ echo: 'twse' })
}

const getLegalPersonByIndex = async (req, res) => {
  try {
    const { data: result } = await axios.get('https://www.twse.com.tw/fund/BFI82U', {
      params: {
        response: 'json',
      },
    })

    const index = result.data.reduce((prev, curr) => {
      prev[curr[0]] = { buy: curr[1], sell: curr[2], total: curr[3] }
      return prev
    }, {})

    await stockRef.updateStock({
      date: date,
      index: index,
    })

    res.json(result.data)
  } catch (err) {
    res.json(err.message)
  }
}

module.exports = {
  echo,
  getLegalPersonByIndex,
}
