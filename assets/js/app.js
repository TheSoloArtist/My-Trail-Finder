var retrievedQuery = false;
var latitude = null;
var longitude = null;
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
    latitude = geocode[0];
    longitude = geocode[1];
    restaurantSearch();
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


    //   var stickItToPage= `<a class="weatherwidget-io" href="https://forecast7.com/en/34d05n118d24/${city}/?unit=us"
    //   data-label_1="LOS ANGELES" data-label_2="WEATHER" data-days="3" data-theme="kiwi">${city} weather</a>
    // <script>
    //   !function (d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.src = 'https://weatherwidget.io/js/widget.min.js'; fjs.parentNode.insertBefore(js, fjs); } }(document, 'script', 'weatherwidget-io-js');
    // </script>`
    // $(".weatherShow").append(stickItToPage)
    // });
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

  });

}