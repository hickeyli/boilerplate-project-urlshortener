require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.get('/api/shorturl', function(req, res) {
  const { url } = req.query;

  // Check if the URL is valid
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Perform DNS lookup to verify the hostname
    dns.lookup(hostname, function(err) {
      if (err) {
        res.json({ error: 'Invalid URL' });
      } else {
        // Save the URL to the database and return the shortened URL
        // Your code here...
        res.json({ original_url: url, short_url: 1 });
      }
    });
  } catch (error) {
    res.json({ error: 'Invalid URL' });
  }
});

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
