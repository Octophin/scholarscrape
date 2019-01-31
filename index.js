// Load dependencies

const request = require("request"), // Simplify HTTP requests
  cheerio = require('cheerio'), // Parse HTML
  express = require('express'), // Web server
  fs = require("fs"), // Read from file system
  app = express(); // Initialise app

// Load in configuration file

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

// Store in memory cache object keyed by author id

let cache = {};

// Endpoint for Google Scholar ID

app.get('/:scholarID', (req, res) => {

  // Check if in cache, if so send

  if (cache[req.params.scholarID]) {

    return res.send(cache[req.params.user]);

  }

  let output = `<!doctype HTML><head><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Type" content="text/html;charset=UTF-8"></head>`;

  // Add stylesheet from file

  output += "<style>" + fs.readFileSync("style.css", "utf8") + "</style>";

  request.get({
    uri: 'https://scholar.google.co.uk/citations?user=' + req.params.scholarID + "&sortby=pubdate",
    encoding: "binary"
  }, function (error, request, body) {

    let content = cheerio.load(body);

    content(".gsc_a_tr").each(function (i, elem) {

      let inner = content(this),
        title = inner.find(".gsc_a_at").text(),
        author = inner.find(".gs_gray").eq(0).text(),
        info = inner.find(".gs_gray").eq(1).text(),
        year = inner.find(".gs_ibl").text();

      output += `

            <article>

              <h1>${author}</h1>
              <h2>${title}</h2>
              <span class="year">${year}</span>
              <p>${info}</p>

            </article>


          `;

    });

    res.statusCode = 200;
    res.end(output);

    // Store in cache

    cache[req.params.user] = output;

  });

});

app.listen(config.port);
