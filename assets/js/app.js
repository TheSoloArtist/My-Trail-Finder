var retrievedQuery = false;

function getMap(searchGeocode) {
  console.log("Ran getMap function");
  var centerText =
    "new Microsoft.Maps.Location(" +
    searchGeocode[0] +
    "," +
    searchGeocode[1] +
    ")";

  console.log(centerText);

  var map = new Microsoft.Maps.Map("#parkMap", {
    credentials: config.BING_MAPS_API,
    center: centerText,
    mapTypeId: Microsoft.Maps.MapTypeId.aerial,
    zoom: 10,
  });
}

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

    console.log(geocode);

    retrievedQuery = true;
    return geocode;
  });
}

$(document).ready(function () {
  $("#searchSubmit").on("click", function () {
    event.preventDefault();

    var city = $("#searchQueryCity").val().trim();
    city = city.toLowerCase();
    var state = $("#searchQueryState").val().trim();

    console.log(city + ", " + state);

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
