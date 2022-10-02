const dayjs = require('dayjs')
const { chromium, devices } = require('playwright')

const device = {
  sm: devices['iPhone 12 Pro'],
  md: devices['iPad Pro 11'],
  lg: devices['Desktop Edge'],
}

const getScreenshot = async (url = 'https://example.com', size = 'lg') => {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    ...device[size],
  })

  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })

  const buffer = await page.screenshot({ fullPage: true })
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
      return { size: 'md', url: 'https://invest.cnyes.com/forex/detail/USDTWD/history' }
    case 'ixic':
      return { size: 'md', url: 'https://invest.cnyes.com/index/GI/IXIC' }
    case 'sox':
      return { size: 'md', url: 'https://invest.cnyes.com/index/GI/SOX' }
    case 'dji':
      return { size: 'md', url: 'https://invest.cnyes.com/index/GI/DJI' }
    case 'inx':
      return { size: 'md', url: 'https://invest.cnyes.com/index/GI/INX' }
    case 'ki':
      return { size: 'md', url: 'https://invest.cnyes.com/index/GI/KOSPI' }
    case 'o':
      return { size: 'md', url: `https://invest.cnyes.com/twstock/TWS/${num}` }
    case 'h':
      return { size: 'md', url: `https://invest.cnyes.com/twstock/TWS/${num}/history` }
    case 'f':
      return { size: 'md', url: `https://invest.cnyes.com/twstock/TWS/${num}/finirating` }
    case 'd':
      return { size: 'md', url: `https://invest.cnyes.com/twstock/TWS/${num}/dividend` }
    case 'p':
      return { size: 'md', url: `https://invest.cnyes.com/twstock/TWS/${num}/profile` }
    default:
      return { url: null }
  }
}

module.exports = {
  getConfig,
  getScreenshot,
}
