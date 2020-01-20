# Space Events

#### One-stop shop for Stargazers and lovers of Astronomy!

https://star-lord.herokuapp.com/

---

# Description

#### This applications goal is to provoke the users curiosity into the nature and origin of the universe by providing a glimpse into celestial events.

> The heavens declare the glory of God; And the firmament showeth his handiwork. - Psalm 19:1

# Screenshots

![Main Page](/public/assets/images/Screenshot.png)

# Technologies Used
* NodeJS
* Express
* MySQL
* Sequelize
* Foundation
* stargazing-time (NPM)
* cheerio (NPM)
* Astronomy Picture of the Day (APOD) (NPM / API)
* OpenWeatherApp (API)
* MomentJS
* request (NPM)
* local-web-server (NPM)

# Features

* Daily updated photo from the Astronomy Picture of the Day API
* Upcoming stargazing weather data

# Code Example

#### API route for scraping astronomy events from seasky.org
```
app.get("/api/scrape", function (req, res) {

    axios.get("http://www.seasky.org/astronomy/astronomy-calendar-2020.html").then(function (response) {

      let $ = cheerio.load(response.data);

      $("li").each(function (i, elem) {

        const urlTitles = $(this).find("span.title-text").text();
        const urlDates = $(this).find("span.date-text").text();
        const result = {};

        if (urlTitles && urlDates !== "") {
          result.title = urlTitles;
          result.date = urlDates;
        }

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
  ```
  
  # API Reference
  
  * [APOD](https://www.npmjs.com/package/apod-nasa)
  * [Stargazing-Time](https://www.npmjs.com/package/stargazing-time)
  
  # How to Use
  
  * Sign up and create a username and password, or sign in with your existing username and password 
  * Upon logging in, the main page will display upcoming events
  * Click the favorite button to save an event
  * Check out the photo of the day displayed in the favorited events menu
  * Click the Upcoming Stargaze Dates link in the navigation menu and enter a city to find the best upcoming weather conditions for stargazing
