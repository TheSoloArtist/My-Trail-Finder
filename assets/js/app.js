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
      this.latitude = geocode[0];
      this.longitude = geocode[1];
      restaurantSearch();
      console.log(this.latitude);
      console.log(this.longitude);
      //$("#retrievedGeocode").trigger("click");
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

    currLocation.geocode(city, state);
  });
});
