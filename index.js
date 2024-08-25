require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.post('/api/shorturl', (req, res) => {
  const short_url = req.params.short_url;
  const url = urls[short_url];
    if (url) {
      res.redirect(url);
    }
    else {
      res.json({ error: 'invalid URL' });
    }
  }
);

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
