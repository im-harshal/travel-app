// Check if user is logged in
function checkLoginStatus() {
  $.ajax({
    url: "php/check_session.php",
    type: "GET",
    dataType: "json",
    success: function (response) {
      if (!response.loggedIn) {
        // Redirect to login page if not logged in
        window.location.href = "index.html";
      } else {
        $("#user-name").text(response.firstname + " " + response.lastname);

        // Toggle divs based on phone value
        if (response.phone === "222-222-2222") {
          $("#div-admin").show();
          $("#div-user").hide();
        } else {
          $("#div-admin").hide();
          $("#div-user").show();
        }
      }
    },
    error: function () {
      window.location.href = "index.html";
    },
  });
}

// Update datetime
function updateDateTime() {
  const now = new Date();
  $("#datetime").text(now.toLocaleString());
}

$(document).ready(function () {
  // Check login status immediately
  checkLoginStatus();

  // Update datetime every second
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // Check if the button should be disabled
  if (localStorage.getItem("flightsLoaded") === "true") {
    $("#load-flights-button")
      .prop("disabled", true)
      .text("Flight Data Loaded")
      .css("background-color", "#ccc");
  }
  // Add event listener for the "Load Flights" button
  $("#load-flights-button").on("click", function () {
    $.ajax({
      url: "php/load_flights.php",
      type: "POST",
      success: function (response) {
        alert(response); // Show success or error message
        if (response.trim() === "Flights loaded successfully!") {
          $("#load-flights-button")
            .prop("disabled", true)
            .text("Flight Data Loaded")
            .css("background-color", "#ccc");
          localStorage.setItem("flightsLoaded", "true"); // Persist state
        }
      },
      error: function () {
        alert("An error occurred while loading flights.");
      },
    });
  });

  // Check if the button should be disabled
  if (localStorage.getItem("hotelsLoaded") === "true") {
    $("#load-hotels-button")
      .prop("disabled", true)
      .text("Hotel Data Loaded")
      .css("background-color", "#ccc");
  }

  // Add event listener for the "Load Hotels" button
  $("#load-hotels-button").on("click", function () {
    $.ajax({
      url: "php/load_hotels.php",
      type: "POST",
      success: function (response) {
        alert(response); // Show success or error message
        if (response.trim() === "Hotels loaded successfully!") {
          $("#load-hotels-button")
            .prop("disabled", true)
            .text("Hotel Data Loaded")
            .css("background-color", "#ccc");
          localStorage.setItem("hotelsLoaded", "true"); // Persist state
        }
      },
      error: function () {
        alert("An error occurred while loading flights.");
      },
    });
  });
});
