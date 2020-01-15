// Requiring our models
const db = require("../models");
const request = require('request');
const axios = require("axios");
const cheerio = require('cheerio');
const StargazingTime = require('stargazing-time');

// Routes
// =============================================================
module.exports = function (app) {

  // Route for scrraping event data

  app.get("/api/scrape", function (req, res) {

    axios.get("http://www.seasky.org/astronomy/astronomy-calendar-2020.html").then(function (response) {

      let $ = cheerio.load(response.data);

      // const urlElems = $("li");

      // for (let i = 0; i < urlElems.length; i++) {

      //   const urlDates = $(urlElems[i]).find("span.date-text");
      //   const urlTitles = $(urlElems[i]).find("span.title-text");

      //   if (urlDates && urlTitles) {

      //     const titleText = $(urlTitles).text();
      //     const dateText = $(urlDates).text();

      //     console.log("Title text " + titleText);
      //     console.log("Date text " + dateText);

      //   }

      // }

      $("li").each(function (i, elem) {

        // const urlElems = $(this);
        const urlTitles = $(this).find("span.title-text").text();
        const urlDates = $(this).find("span.date-text").text();
        const result = {};

        // for (var x = 0; x < urlElems.length; x++) {

        if (urlTitles && urlDates !== "") {
          result.title = urlTitles;
          result.date = urlDates;
        }

        // }

        // const result = {};

        // result.date = $(this)
        //   .find("span.date-text").text();

        // result.title = $(this)
        //   .find("span.title-text").text();

        db.Events.create(result)
          .then(function (dbEvent) {
            // View the added result in the console
            console.log("Events Result: " + dbEvent);
          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
          });

      });

      // Send a message to the client
      res.send("Scrape Complete");

    });
  });

  //   GET route for getting all of the events
  app.get("/api/events", function (req, res) {
    db.Events.findAll().then(function (eventData) {
      res.json(eventData);
    });
  });

  //Stargaze route for getting a certain city through openweather app
  app.get("/api/stargaze/:city", function (req, res) {
    StargazingTime.getGoodTimes({
      city: req.params.city + ',us',
      apiKey: '028bfc49fd0424eb39c6628c6a864f9e'
    })
      .then(function (data) {
        res.json(data);
      });
  });

  // Favorite / Unfavorite event update route
  app.put("/api/events/:id", function (req, res) {
    db.Events.update({ favorited: req.body.favorited }, //was 1
      {
        where: {
          id: req.params.id
        }
      }).then(function (results) {
        res.json(results);
      });
  });

  //APOD image GET route
  app.get("/api/apod", function (req, res) {

    let apodData;
    let image;

    //Start Request to APOD API
    request(
      {
        method: "GET",
        url: "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
      },
      (err, response) => {
        if (err) {
          console.log(err);
        } else {

          // console.log("--------APOD RES BODY: ", response.body);
          apodData = JSON.parse(response.body);

          image = apodData.url;
          // console.log("--------APOD RES BODY IMG o Day: ", image);


          res.send(apodData);
        }//end ELSE stmnt
      }//end Request callback fct
    );//End Request to APOD API
  });

}