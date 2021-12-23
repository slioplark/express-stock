const dayjs = require('dayjs')
const puppeteer = require('puppeteer')

const getScreenshot = async (url = 'https://example.com', w, h) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })

  const page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0')
  await page.goto(url, { waitUntil: 'networkidle0' })
  const { pageWidth, pageHeight } = await page.evaluate(() => {
    return {
      pageWidth: window.innerWidth,
      pageHeight: document.documentElement.scrollHeight,
    }
  })
  await page.setViewport({
    width: w || pageWidth,
    height: h || pageHeight,
    deviceScaleFactor: pageWidth * 2 < pageHeight ? 1 : 2,
  })

  const buffer = await page.screenshot({
    fullPage: true,
    encoding: 'binary',
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
    case 'btc':
      return { url: 'https://www.pionex.com/zh-TW/trade/BTC_USDT/pionex.v2', w: 1280 }
    case 'pionex':
      return { url: 'https://www.pionex.com/zh-TW/market/ranks', w: 1280, h: 1080 }
    case 'raydium':
      return { url: 'https://raydium.io/acceleraytor/', w: 1280 }
    case 'fmc':
      return { url: `https://moneydj.emega.com.tw/z/ze/zej/zej.djhtm?A=EV000060&B=${day}&C=2` }
    case 'exd':
      return { url: `https://moneydj.emega.com.tw/z/ze/zej/zej.djhtm?A=EV000020&B=${day}&C=2` }
    case 'fbs':
      return { url: `https://moneydj.emega.com.tw/z/zg/zgk.djhtm?A=D&B=0&C=${num}` }
    case 'mbs':
      return { url: `https://moneydj.emega.com.tw/z/zg/zgk.djhtm?A=F&B=0&C=${num}` }
    case 'ibs':
      return { url: `https://moneydj.emega.com.tw/z/zg/zgk.djhtm?A=DD&B=0&C=${num}` }
    case 'sbs':
      return { url: `https://moneydj.emega.com.tw/z/zg/zgk.djhtm?A=DB&B=0&C=${num}` }
    case 'lp':
      return { url: `https://moneydj.emega.com.tw/z/zc/zcl/zcl.djhtm?a=${num}&b=2` }
    case 'usd':
      return { url: 'https://invest.cnyes.com/forex/detail/USDTWD/history' }
    case 'ixic':
      return { url: 'https://invest.cnyes.com/index/GI/IXIC' }
    case 'sox':
      return { url: 'https://invest.cnyes.com/index/GI/SOX' }
    case 'dji':
      return { url: 'https://invest.cnyes.com/index/GI/DJI' }
    case 'inx':
      return { url: 'https://invest.cnyes.com/index/GI/INX' }
    case 'ki':
      return { url: 'https://invest.cnyes.com/index/GI/KOSPI' }
    case 'o':
      return { url: `https://invest.cnyes.com/twstock/TWS/${num}` }
    case 'h':
      return { url: `https://invest.cnyes.com/twstock/TWS/${num}/history` }
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
