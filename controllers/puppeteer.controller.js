const puppeteer = require('puppeteer')

const getScreenshot = async (url = 'https://example.com') => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })

  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle0' })
  const buffer = await page.screenshot({
    encoding: 'binary',
    omitBackground: true,
    clip: {
      x: 0,
      y: 0,
      width: 800,
      height: 1024,
    },
  })

  await browser.close()

  return buffer
}

module.exports = {
  getScreenshot,
}
