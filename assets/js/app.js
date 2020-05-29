firebase.initializeApp(config.firebaseConfig);

var database = firebase.database();

let currLocation = {
  latitude: 34.052235,
  longitude: -118.243683,

  geocode: function (city, state) {
    var geocodeURL =
      "http://dev.virtualearth.net/REST/v1/Locations?CountryRegion=US&adminDistrict=" +
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
      restaurantSearch();

      console.log(currLocation.latitude);
      console.log(currLocation.longitude);

      map.setView({
        mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        center: new Microsoft.Maps.Location(
          currLocation.latitude,
          currLocation.longitude
        ),
        zoom: 10,
      });

      addHikingTrails();
    });
  },

  geocodeOnlyState: function (state) {
    var geocodeURL =
      "http://dev.virtualearth.net/REST/v1/Locations?CountryRegion=US&adminDistrict=" +
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
      restaurantSearch();

      console.log(currLocation.latitude);
      console.log(currLocation.longitude);

      map.setView({
        mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        center: new Microsoft.Maps.Location(
          currLocation.latitude,
          currLocation.longitude
        ),
        zoom: 10,
      });

      addHikingTrails();
    });
  },
};

function restaurantSearch() {
  $(".restaurant").html("<h5>Resturants Nearby</h5>");
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

function isAlphanet(string) {
  var letters = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;

  if (string.match(letters)) {
    return true;
  } else {
    return false;
  }
}

function addHikingTrails() {
  $("#nearbyeParks").html("");
  var bgRanNum = Math.floor(Math.random() * 7);
  $("body,html").css(
    "background-image",
    "url('./assets/images/backgrounds/0" + bgRanNum + ".jpg')"
  );
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

    var pin = new Microsoft.Maps.Pushpin(
      { latitude: currLocation.latitude, longitude: currLocation.longitude },
      {
        title: "You are here",
        icon:
          "https://bingmapsisdk.blob.core.windows.net/isdksamples/defaultPushpin.png",
      }
    );

    map.entities.push(pin);

    for (var i = 0; i < trails.length; i++) {
      var pin = new Microsoft.Maps.Pushpin(
        { latitude: trails[i].latitude, longitude: trails[i].longitude },
        {
          title: trails[i].name,
          color: "green",
          subTitle: trails[i].type,
        }
      );

      map.entities.push(pin);

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

      // Adding to div
      var tContDiv = $("<div>");
      tContDiv.attr("class", "tContDiv");

      var tNameDiv = $("<div>");
      tNameDiv.attr("class", "tNameDiv");
      tNameDiv.html("<p><b>" + trails[i].name + "</b></p>");

      var tDiffDiv = $("<div>");
      tDiffDiv.attr("class", "tDiffDiv");
      tDiffDiv.html("<p>" + translateDifficulty + "</p>");

      var tPicSrc = "";
      if (trails[i].imgSqSmall == "") {
        tPicSrc = "assets/images/placeholder.png";
      } else {
        tPicSrc = trails[i].imgSqSmall;
      }

      var tPicDiv = $("<div>");
      tPicDiv.attr("class", "tPicDiv");
      var newImg = $("<img>");
      newImg.attr("class", "tPicImg");
      newImg.attr("src", tPicSrc);
      tPicDiv.append(newImg);

      var tDescDiv = $("<div>");
      tDescDiv.attr("class", "tDescDiv");
      tDescDiv.html("<p>" + trails[i].summary + "</p>");

      var tButtonDiv = $("<div>");
      tButtonDiv.attr("class", "tButtonDiv");

      var addFavDiv = $("<div>");
      addFavDiv.attr("class", "addFavDiv");
      addFavDiv.html(`<a class="parkBtn" onclick="">I Hiked This!</a>`);

      var getDirDiv = $("<div>");
      getDirDiv.attr("class", "getDirDiv");
      getDirDiv.html(
        `<a class="parkBtn" href="${trails[i].url}" target="_blank">More info</a>`
      );

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

$(document).ready(function () {
  /* When the search button is clicked, it takes
   * the searchbar input to "city" and the drop
   * down value to the state.
   */
  $(".replaceWithUser").html(user.name);
  $(".replaceWithScore").html(user.score);
  addHikingTrails();

  $("#searchSubmit").on("click", function () {
    event.preventDefault();

    var city = $("#searchQueryCity").val().trim();
    console.log(isAlphanet(city));
    var state = $("#searchQueryState").val().trim();

    if (city != "" && isAlphanet(city)) {
      city = city.toLowerCase();

      console.log(city + ", " + state);

      currLocation.geocode(city, state);
    } else if (city == "") {
      currLocation.geocodeOnlyState(state);
      console.log(state);
    }
  });
});
