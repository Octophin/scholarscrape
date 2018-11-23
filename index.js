const request = require("request");
const cheerio = require('cheerio');

const express = require('express')
const app = express()

const fs = require("fs");

let cache = {};

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

app.get('/', (req, res) => res.status(400).send("Missing user ID path. Try /yourgooglescholarid"))

app.get('/:user', (req, res) => {

  if (cache[req.params.user]) {

   return res.send(cache[req.params.user]);

  }

  let output = `<!doctype HTML><head><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Type" content="text/html;charset=UTF-8"></head>`;

  output += "<ul>";

  request.get({
    uri: 'https://scholar.google.co.uk/citations?user=' + req.params.user,
    encoding: "binary"
  }, function (error, request, body) {

    let content = cheerio.load(body);

    content(".gsc_a_tr").each(function (i, elem) {

      let inner = content(this);

      output += "<li>";

      output += "<b>" + inner.find(".gsc_a_at").text() + "</b>";

      output += " - <small>" + inner.find(".gs_gray").text() + "</small>";

      output += "</li>";

    });

    output += "</ul>";

    output += `

    <style>

    body {font-family: sans-serif;}

    </style>

    `;

    res.statusCode = 200;
    res.end(output);

    cache[req.params.user] = output;

  });

})

app.listen(config.port);
