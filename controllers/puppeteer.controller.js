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

module.exports = {
  getScreenshot,
}
