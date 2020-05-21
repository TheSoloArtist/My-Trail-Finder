function parseInput(place) {
  if (place.match(/[a-z]/i) == null) {
    return;
  }
  place = place.trim();
  place = place.toLowerCase();

  var comma = place.indexOf(",");
  var city = place.slice(0, comma);
  var state = place.slice(comma, place.length);

  return [city, state];
}

$(document).ready(function () {
  $("#searchSubmit").on("click", function () {
    event.preventDefault();

    var newSearch = $("#searchQuery").val().trim();

    newSearch = parseInput(newSearch);

    console.log(newSearch);
  });
});
