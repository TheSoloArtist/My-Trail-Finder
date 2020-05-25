/* This is used to ensure the getMap function is not
 * added until the coordinates are retrieved from
 * BingMaps
 * */
var latitude = null;
var longitude = null;

/* This takes in the inputted city and state and
 * sends it to Bing Maps to get the coordinates.
 * Returns the coordinates
 */
function geocode(city, state) {
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
    latitude = geocode[0];
    longitude = geocode[1];
    restaurantSearch();
    map.setView({
      mapTypeId: Microsoft.Maps.MapTypeId.aerial,
      center: new Microsoft.Maps.Location(geocode[0], geocode[1]),
      zoom: 10,
    });
    console.log("Attempted to change map");
  });
}

/* All functions that begin when the HTML page has
 * loaded will go below
 */
$(document).ready(function () {
  /* When the search button is clicked, it takes
   * the searchbar input to "city" and the drop
   * down value to the state.
   */
  $("#searchSubmit").on("click", function () {
    event.preventDefault();

    var city = $("#searchQueryCity").val().trim();
    city = city.toLowerCase();
    var state = $("#searchQueryState").val().trim();

    console.log(city + ", " + state);

    // Sets coordinates of location to searchGeocode
    var searchGeocode = geocode(city, state);
  });
});

function restaurantSearch() {
  var settings = {
    async: true,
    crossDomain: true,
    url: `https://tripadvisor1.p.rapidapi.com/restaurants/list-by-latlng?limit=3&currency=USD&distance=2&lunit=km&lang=en_US&latitude=${latitude}&longitude=${longitude}`,
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
