# ScholarScrape

Basic node.js based Google Scholar citations scraper with built-in caching. [Demo here fetching Einstein's citations](https://scholarscrape.octophindigital.com/qc6CJjYAAAAJ&hl=en).

# Requirements

* Node.js
* NPM

# Installation

* Git Clone or Download
* Run `npm install`
* Add port you wish server to run on to `config.json`
* Add how long each scholar ID's data should be kept as `cacheDays` in `config.json`
* Run `node index.js` to run webserver on selected port on localhost, e.g `localhost:2888'

# Usage

* Only one URL endpoint is available, the Google Scholar ID. For example `http://localhost:7888/qc6CJjYAAAAJ&hl`.
* Everything is output as one aggregated file with static HTML and CSS for easy embedding.

# Customisation / styling

* The output template code in `index.js` should be easy enough to change, as should the styling in `style.css`.
