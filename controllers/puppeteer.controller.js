const puppeteer = require('puppeteer')

const getScreenshot = async (url = 'https://example.com') => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })

  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle0' })
  await page.setViewport({ width: 1024, height: 1024 })
  const buffer = await page.screenshot({
    encoding: 'binary',
    omitBackground: true,
  })

  await browser.close()

  return buffer
}

module.exports = {
  getScreenshot,
}
