firebase.initializeApp(config.firebaseConfig);

var database = firebase.database();

// Connects to the firebase database to update the score
// In the future, this will be updated to allow the name to be updated
// As well as adding function to track the actual trails that users are hiking.

let user = {
  name: "Trailblazer",
  score: 0,
};

// Keeps track of the current location being searched for and displayed.
// Automatically set to LA
let currLocation = {
  latitude: 34.052235,
  longitude: -118.243683,

  // Translates location to geocode when given city and state
  geocode: function (city, state) {
    var geocodeURL =
      "https://dev.virtualearth.net/REST/v1/Locations?CountryRegion=US&adminDistrict=" +
      state +
      "&locality=" +
      city +
      "&key=" +
      config.BING_MAPS_API;

    $.ajax({
      url: geocodeURL,
      method: "GET",
    }).then(function (response) {
      var geocode =
        response.resourceSets[0].resources[0].geocodePoints[0].coordinates;
      currLocation.latitude = geocode[0];
      currLocation.longitude = geocode[1];

      // Checks the weather according to geocode
      checkWeather();
      // Searches for restaurants near current geocode
      restaurantSearch();

      console.log(currLocation.latitude);
      console.log(currLocation.longitude);

      // Changes the map display based on new geocode
      map.setView({
        mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        center: new Microsoft.Maps.Location(
          currLocation.latitude,
          currLocation.longitude
        ),
        zoom: 10,
      });

      // Searches for trails nearbye, adds markers, and adds information about trails
      addHikingTrails();
    });
  },

  // Translates location to geocode when only given state
  geocodeOnlyState: function (state) {
    var geocodeURL =
      "https://dev.virtualearth.net/REST/v1/Locations?CountryRegion=US&adminDistrict=" +
      state +
      "&key=" +
      config.BING_MAPS_API;

    $.ajax({
      url: geocodeURL,
      method: "GET",
    }).then(function (response) {
      var geocode =
        response.resourceSets[0].resources[0].geocodePoints[0].coordinates;
      currLocation.latitude = geocode[0];
      currLocation.longitude = geocode[1];

      // Checks weather based on geocode
      checkWeather();
      // Searches for restaurants near current geocode
      restaurantSearch();

      console.log(currLocation.latitude);
      console.log(currLocation.longitude);

      // Changes the map display based on new geocode
      map.setView({
        mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        center: new Microsoft.Maps.Location(
          currLocation.latitude,
          currLocation.longitude
        ),
        zoom: 10,
      });

      // Searches for trails nearbye, adds markers, and adds information about trails
      addHikingTrails();
    });
  },
};

// Searches for 3 restaurants near given geocode and displays in its respective sidebar
function restaurantSearch() {
  $(".restaurant").html("<h5>Resturants Nearby</h5>"); // Clears the div before adding new results
  var settings = {
    async: true,
    crossDomain: true,
    url: `https://tripadvisor1.p.rapidapi.com/restaurants/list-by-latlng?limit=3&currency=USD&distance=2&lunit=km&lang=en_US&latitude=${currLocation.latitude}&longitude=${currLocation.longitude}`,
    method: "GET",
    headers: {
      "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
      "x-rapidapi-key": "adb75d27cfmshe591e88122b81ffp14a2e1jsnaed0acc3fb97",
    },
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    let myRes = response.data;
    for (var i = 0; i < myRes.length; i++) {
      var wrapper = $("<div>");
      wrapper.attr("class", "Pleasechangeme");
      var pTag = $("<p>");
      pTag.text(myRes[i].name);
      var phone = $("<p>");
      phone.text("Tell: " + myRes[i].phone);

      // after creating all the tags we have to append them to the wrapper and then append the wrapper to the div with the class of restuarant
      wrapper.append(pTag, phone);
      $(".restaurant").append(wrapper);
    }
  });
}

// Checks whether the string given is alphabetical with either a hyphen or a space connecting the words
// Used to make sure the user isn't putting numbers or symbols into the searchbar
function isAlphanet(string) {
  var letters = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;

  if (string.match(letters)) {
    return true;
  } else {
    return false;
  }
}

// Searches for trails nearbye, adds markers, and adds information about trails
// Changes the background picture every time it's run
function addHikingTrails() {
  $("#nearbyeParks").html(""); // Clears the div before adding new results
  var bgRanNum = Math.floor(Math.random() * 7); // Chooses a random number between 0 and 6
  $("body,html").css(
    "background-image",
    "url('./assets/images/backgrounds/0" + bgRanNum + ".jpg')"
  ); // References the background corresponding to said random number
  var trailsUrl =
    "https://www.hikingproject.com/data/get-trails?lat=" +
    currLocation.latitude +
    "&lon=" +
    currLocation.longitude +
    "&maxDistance=50&key=" +
    config.HIKING_API;

  $.ajax({
    url: trailsUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    var trails = response.trails;

    // Creates a marker for the location searched for
    var pin = new Microsoft.Maps.Pushpin(
      { latitude: currLocation.latitude, longitude: currLocation.longitude },
      {
        title: "★",
        icon:
          "https://bingmapsisdk.blob.core.windows.net/isdksamples/defaultPushpin.png",
      }
    );

    // Adds the marker to the map
    map.entities.push(pin);

    // Creates and adds a marker for each search result
    for (var i = 0; i < trails.length; i++) {
      var pin = new Microsoft.Maps.Pushpin(
        { latitude: trails[i].latitude, longitude: trails[i].longitude },
        {
          title: trails[i].name,
          color: "yellow",
          subTitle: trails[i].type,
        }
      );

      map.entities.push(pin);

      // The hiking api returns colours instead of written difficulty
      // Translating those terms to display
      var translateDifficulty = "";

      if (trails[i].difficulty == "black") {
        translateDifficulty = "Difficult";
      } else if (trails[i].difficulty == "blueBlack") {
        translateDifficulty = "Moderate";
      } else if (trails[i].difficulty == "blue") {
        translateDifficulty = "Okay";
      } else {
        translateDifficulty = "Easy";
      }

      // Creating the display of the search term
      // Container
      var tContDiv = $("<div>");
      tContDiv.attr("class", "tContDiv");

      // Name of trail
      var tNameDiv = $("<div>");
      tNameDiv.attr("class", "tNameDiv");
      tNameDiv.html("<p><b>" + trails[i].name + "</b></p>");

      // Difficulty of trail (using the translation)
      var tDiffDiv = $("<div>");
      tDiffDiv.attr("class", "tDiffDiv");
      tDiffDiv.html("<p>" + translateDifficulty + "</p>");

      // Some of the trails don't have pictures.
      // If there's no picture, it gives a placeholder
      var tPicSrc = "";
      if (trails[i].imgSqSmall == "") {
        tPicSrc = "assets/images/placeholder.png";
      } else {
        tPicSrc = trails[i].imgSqSmall;
      }

      // Creating the picture div
      var tPicDiv = $("<div>");
      tPicDiv.attr("class", "tPicDiv");
      var newImg = $("<img>");
      newImg.attr("class", "tPicImg");
      newImg.attr("src", tPicSrc);
      tPicDiv.append(newImg);

      // Trail summary
      var tDescDiv = $("<div>");
      tDescDiv.attr("class", "tDescDiv");
      tDescDiv.html("<p>" + trails[i].summary + "</p>");

      // Button container div
      var tButtonDiv = $("<div>");
      tButtonDiv.attr("class", "tButtonDiv");

      // Button that lets the user say they hiked the particular trail.
      // Right now it doesn't check whether the user has already hiked the trail.
      // Will add this later.
      var addFavDiv = $("<div>");
      addFavDiv.attr("class", "addFavDiv");
      addFavDiv.html(
        `<a class="parkBtn" href="" onclick="addToList('${trails[i].name}');">✓</a>`
      );

      // Button that sends user to a webpage with more information
      var getDirDiv = $("<div>");
      getDirDiv.attr("class", "getDirDiv");
      getDirDiv.html(
        `<a class="parkBtn" href="${trails[i].url}" target="_blank">Info</a>`
      );

      // Adding all the divs to the display
      tButtonDiv.append(addFavDiv);
      tButtonDiv.append(getDirDiv);

      tContDiv.append(tNameDiv);
      tContDiv.append(tDiffDiv);
      tContDiv.append(tPicDiv);
      tContDiv.append(tDescDiv);
      tContDiv.append(tButtonDiv);

      $("#nearbyeParks").append(tContDiv);
    }
  });
}

function checkWeather() {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    currLocation.latitude +
    "&lon=" +
    currLocation.longitude +
    "&appid=" +
    config.WEATHER_API;

  // Here we run our AJAX call to the OpenWeatherMap API
  $.ajax({
    url: queryURL,
    method: "GET",
  })
    // We store all of the retrieved data inside of an object called "response"
    .then(function (response) {
      console.log(response);
      var weatherPlace = response.name;
      var weatherType = response.weather[0].main;

      $(".replaceWithPlace").html(weatherPlace);
      $(".replaceWithWeatherType").html(weatherType);
    });
}

// When trail button clicked, user says they hiked it and automatically get a point.
// Needs to be updated to include check for previous hikes.
// Also needs to ask user to input comments on their hike.
// Also needs to take in info about trail for future use
function addToList(trailName) {
  user.score++;

  database.ref().set({
    score: user.score,
  });
}

// Updates database
database.ref().on("value", function (snapshot) {
  console.log(snapshot.val());

  user.score = snapshot.val().score;

  $(".replaceWithScore").html(snapshot.val().score);
});

$(document).ready(function () {
  // Automatically replaces respective divs with the value in user's name and score
  $(".replaceWithUser").html(user.name);
  $(".replaceWithScore").html(user.score);

  checkWeather();
  // Adds hiking trails for initial geocode
  addHikingTrails();

  // When search is submitted it gathers the information, checks it, and sends it to
  // be translated into a geocode
  $("#searchSubmit").on("click", function () {
    event.preventDefault();

    var city = $("#searchQueryCity").val().trim();
    var state = $("#searchQueryState").val().trim();

    // If city input is not blank and the city is valid, it runs the geocode that requires city, state
    if (city != "" && isAlphanet(city)) {
      city = city.toLowerCase();

      console.log(city + ", " + state);

      currLocation.geocode(city, state);
    }
    // If city input is blank, it'll run the geocode that only requires the state
    else if (city == "") {
      currLocation.geocodeOnlyState(state);
      console.log(state);
    }
  });
});
