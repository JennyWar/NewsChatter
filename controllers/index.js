// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("../models");

module.exports = {
    home: function(req,res) {
        res.render('../views/home');
    },
  scrape: function(req, res) {
    // First, we grab the body of the html with request
    axios.get("https://www.stereogum.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $(".left-col div:nth-child(1) .post").each(function(i, element) {

      // Save an empty result object

      console.log('-------------------------------')
    //   console.log($(element).find("a").attr("href"))

      let result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(element)
        .find('h2')
        .text();

      result.link = $(element)
        .find('a')
        .attr("href");

        result.headline = $(element)
        .find('.preview')
        .text();

        console.log(result)
        console.log('-------------------------------')
        
      // Create a new Article using the `result` object built from scraping
      db.Headline.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
          console.log(result);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
            console.log(result);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  
    });
  },

  getArticles: function(req, res) {
    // Grab every document in the Articles collection
    db.Headline.find({})
    .limit(20)
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  },

  getArticle: function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Headline.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  },

  updateArticle: function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Note.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbHeadline) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  }
}