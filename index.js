const express = require('express');
const path = require('path');
const axios = require('axios');
const puppeteer = require('puppeteer');

const app = express();

// Enable JSON parsing for POST requests (if needed)
app.use(express.json());

// Serve static files from the "dist" directory
app.use(express.static(path.join(__dirname, 'dist')));

/**
 * Basic Proxy Endpoint using Axios.
 *
 * Usage:
 *   GET /proxy?url=https://example.com
 *
 * This endpoint fetches the HTML content of the provided URL.
 */
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    const response = await axios.get(targetUrl, {
      responseType: 'text',
      headers: {
        // Forward the incoming User-Agent header, or use a default browser UA string
        'User-Agent': req.get('User-Agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });
    
    // Optionally, you might want to modify or remove problematic headers in the HTML.
    const content = response.data;
    res.send(content);
  } catch (error) {
    console.error('Error fetching URL with Axios:', error.message);
    res.status(500).send('Error fetching URL');
  }
});

/**
 * Advanced Proxy Endpoint using Puppeteer.
 *
 * Usage:
 *   GET /proxy-puppeteer?url=https://example.com
 *
 * This endpoint launches a headless browser, loads the target URL, and returns the rendered HTML.
 */
app.get('/proxy-puppeteer', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('Missing url parameter');
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for many hosting environments
    });
    const page = await browser.newPage();
    await page.setUserAgent(req.get('User-Agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    
    // Navigate to the target URL and wait until the network is idle.
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Get the fully rendered HTML content.
    const content = await page.content();
    res.send(content);
  } catch (error) {
    console.error('Puppeteer error:', error.message);
    res.status(500).send('Error fetching URL via Puppeteer');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
