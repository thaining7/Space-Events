$(document).foundation()



$(document).ready(function () {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function (data) {
    let userName = data.email.split("@")[0];
    $("#member-name").text(userName);
  });
});


$.get("/api/apod", function (data) {

  console.log(data);

  const mediaURL = data.url;
  const mediaTitle = data.title;

  if (data.media_type === "video") {
    var media = $("<div class='responsive-embed'>")
    .append("<iframe width='420' height='315' src='" + mediaURL + "' frameborder='0' allowfullscreen></iframe>");
  } else {
    var media = $("<img>")
    .attr("src", mediaURL);
  }

  $("#fav-img")
    .append(media)
    .append(mediaTitle);

});
