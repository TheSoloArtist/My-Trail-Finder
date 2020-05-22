/* This is used to ensure the getMap function is not
 * added until the coordinates are retrieved from
 * BingMaps
 * */
var retrievedQuery = false;

/* Function takes in coordinates and creates the
 * BingMaps based off them.
 */
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

    console.log(geocode);

    retrievedQuery = true;
    return geocode;
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

    /* This ensures the program does not run
     * getMap function until the geocode has loaded
     */

    if (retrievedQuery === true) {
      retrievedQuery = false;
      console.log(searchGeocode);
      getMap(searchGeocode);
    }
  });
});
