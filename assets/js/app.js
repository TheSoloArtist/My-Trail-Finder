/* This is used to ensure the getMap function is not
 * added until the coordinates are retrieved from
 * BingMaps
 * */
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
};

function restaurantSearch() {
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

function addHikingTrails() {
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

    console.log("ranpushpins");
    console.log(trails);

    var pin = new Microsoft.Maps.Pushpin(
      { latitude: currLocation.latitude, longitude: currLocation.longitude },
      {
        title: "You are here",
        color: "red",
        subTitle: "Subtitle",
        text: "You are here",
      }
    );

    map.entities.push(pin);

    for (var i = 0; i < trails.length; i++) {
      console.log("Added pushpin" + trails[i].name);

      var pin = new Microsoft.Maps.Pushpin(
        { latitude: trails[i].latitude, longitude: trails[i].longitude },
        {
          title: trails[i].name,
          subTitle: trails[i].type,
          text: trails[i].name,
        }
      );

      map.entities.push(pin);
    }
  });
}

$(document).ready(function () {
  /* When the search button is clicked, it takes
   * the searchbar input to "city" and the drop
   * down value to the state.
   */
  addHikingTrails();

  $("#searchSubmit").on("click", function () {
    event.preventDefault();

    var city = $("#searchQueryCity").val().trim();
    city = city.toLowerCase();
    var state = $("#searchQueryState").val().trim();

    console.log(city + ", " + state);

<<<<<<< HEAD
    var searchGeocode = geocode(city, state);

    console.log("Searching for city..");

    if (retrievedQuery === true) {
      retrievedQuery = false;
      console.log(searchGeocode);
      getMap(searchGeocode);
    }

    var fruit = ["kiwi", "orange"];
    console.log(fruit);


     
  });

});

function restaurantSearch() {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://tripadvisor1.p.rapidapi.com/restaurants/list-by-latlng?limit=3&currency=USD&distance=2&lunit=km&lang=en_US&latitude=${latitude}&longitude=${longitude}`,
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
      "x-rapidapi-key": "adb75d27cfmshe591e88122b81ffp14a2e1jsnaed0acc3fb97"
    }
  }

  $.ajax(settings).done(function (response) {
    console.log(response);
    let myRes = response.data
    for (var i = 0; i < myRes.length; i++) {
      var wrapper = $("<div>")
      wrapper.attr("class", "Pleasechangeme")
      var pTag = $("<p>")
      pTag.text(myRes[i].name)
      var phone = $("<p>")
      phone.text("Tell: " + myRes[i].phone)

      // after creating all the tags we have to append them to the wrapper and then append the wrapper to the div with the class of restuarant 
      wrapper.append(pTag, phone)
      $(".restaurant").append(wrapper)
    }

=======
    currLocation.geocode(city, state);
>>>>>>> 049fa069a17dbbb1df6ea0ba8d3113a1a82732be
  });
});