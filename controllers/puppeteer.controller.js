const dayjs = require('dayjs')
const puppeteer = require('puppeteer')

const getScreenshot = async (url = 'https://example.com', w = 800, h = 1024) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })

  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle0' })
  const buffer = await page.screenshot({
    encoding: 'binary',
    omitBackground: true,
    clip: {
      x: 0,
      y: 0,
      width: w,
      height: h,
    },
  })

  await browser.close()

  return buffer
}

const getConfig = (text = '') => {
  const list = text.split('.')
  if (list.length !== 2) return { url: null }

  const key = list[0]
  const num = list[1]
  const day = dayjs().add(-7, 'day').format('YYYY-MM-DD')
  switch (key) {
    case 'fmc':
      return { url: `https://moneydj.emega.com.tw/z/ze/zej/zej.djhtm?A=EV000060&B=${day}&C=2` }
    case 'exd':
      return { url: `https://moneydj.emega.com.tw/z/ze/zej/zej.djhtm?A=EV000020&B=${day}&C=2` }
    case 'wo':
      return { url: `https://histock.tw/stock/option.aspx?m=week`, w: 1100, h: 1400 }
    case 'rf':
      return { url: `https://concords.moneydj.com/Z/ZG/ZGK_D.djhtm`, w: 850 }
    case 'ri':
      return { url: `https://concords.moneydj.com/Z/ZG/ZGK_DD.djhtm`, w: 850 }
    case 'rs':
      return { url: `https://concords.moneydj.com/Z/ZG/ZGK_DB.djhtm`, w: 850 }
    case 'rm':
      return { url: `https://concords.moneydj.com/Z/ZG/ZGK_F.djhtm`, w: 850 }
    case 'usd':
      return { url: 'https://invest.cnyes.com/forex/detail/USDTWD/history' }
    case 'ki':
      return { url: 'https://invest.cnyes.com/index/GI/KOSPI', h: 1400 }
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

module.exports = {
  getConfig,
  getScreenshot,
}
