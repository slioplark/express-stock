const puppeteer = require('puppeteer')

const getScreenshot = async (url = 'https://example.com') => {
  const browser = await puppeteer.launch()

  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle0' })
  const buffer = await page.screenshot({
    encoding: 'binary',
    fullPage: true,
    omitBackground: true,
  })

  await browser.close()

  return buffer
}

module.exports = {
  getScreenshot,
}
