
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");
const express = require('express');
const router = express.Router();
// Require all models
var db = require("../models");

const controller = require('../controllers/index')

// Get route for the landing page
router.get('/', controller.home);

// A GET route for scraping the echojs website
router.get("/scrape", controller.scrape);

// Route for getting all Articles from the db
router.get("/articles", controller.getArticles);

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", controller.getArticle);

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", controller.updateArticle);

module.exports = router;