const request = require("request");
const cheerio = require('cheerio');

const express = require('express')
const app = express()

const fs = require("fs");

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

app.get('/:user', (req, res) => {

  let output = "<ul>";

  request('https://scholar.google.co.uk/citations?user=' + req.params.user, function (error, response, body) {

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
    res.setHeader('Content-Type', 'text/html');
    res.end(output);

  });

})

app.listen(config.port);
