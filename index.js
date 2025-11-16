const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/proxy', async (req, res) => {
  const targetUrl = req.body.url;
  if (!targetUrl) return res.send('No URL provided');

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
});
    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: 'networkidle2'});

    const content = await page.content();
    await browser.close();

    res.send(content);
} catch (err) {
    console.error(err);
    res.status(500).send('Failed to load page');
}
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});