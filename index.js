require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const urlParser = require('url');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// In-memory storage for URL mappings
let urlDatabase = [];
let urlCounter = 1;

// Helper function to validate URLs
function isValidUrl(userInput) {
  const urlObject = urlParser.parse(userInput);
  return urlObject.protocol === 'http:' || urlObject.protocol === 'https:';
}

// POST endpoint for shortening URLs
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Validate the URL format
  if (!isValidUrl(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Extract the hostname and check DNS lookup
  const hostname = urlParser.parse(originalUrl).hostname;
  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    // Store the URL with a short URL ID
    const shortUrl = urlCounter;
    urlDatabase.push({ original_url: originalUrl, short_url: shortUrl });
    urlCounter++;

    res.json({ original_url: originalUrl, short_url: shortUrl });
  });
});

// GET endpoint to redirect to the original URL
app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = parseInt(req.params.shortUrl);

  // Find the corresponding URL in the database
  const urlEntry = urlDatabase.find(entry => entry.short_url === shortUrl);

  if (urlEntry) {
    res.redirect(urlEntry.original_url);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

// Basic Configuration
const port = process.env.PORT || 3000;



app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
